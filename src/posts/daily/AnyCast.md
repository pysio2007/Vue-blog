---
title: 记一次AnyCast+博客搭建
date: 2025-02-15
icon: fa-solid fa-router
category: daily
tag:
  - BGP
  - 日常
---

因为闲着没事干, 就打算搭建一个Anycast 然后把博客和DNS都放上去, 本文暂且记录一下Anycast+博客的搭建过程。

## Anycast 是什么?

> Anycast 是一种网络寻址和路由方法, 可以将传入请求路由到各种不同的位置或"节点"。在 CDN 的上下文中, Anycast 通常会将传入的流量路由到距离最近并且能够有效处理请求的数据中心。选择性路由使 Anycast 网络能够应对高流量、网络拥塞和 DDoS 攻击。[^1]

## 前提条件

- 一个ASN
- 一个IPv4/6地址段 
- 多台可BGP Session的服务器 (如果可以 使用多个上游)
- 一个聪明的头脑
- ~~当然 还有一杯咖啡~~

## 1. 寻找一个上游

各大运营商常在托管机房有接入点, 你可以购买机房的托管服务, 然后就应该可以直接联系运营商签约购买带宽及 IP transit 服务。 但是介于国内特色, 这一套下来你只会收到天价的账单 ~~（当然如果你不差钱就当我没说）~~

但是好消息是, 有很多的VPS商家提供BGP Session服务, 例如Vultr BuyVM等等, 你可以选择其中一个作为你的上游。 这些提供商每月价格大约在5-10美元之间, 性价比还算的过去。

你也可以在这里 [BGP Services](https://bgp.services/) 寻找更多的提供商

## 2. 宣告地址

在开始这个步骤之前, 你应该按照商家的要求, 验证你的ASN和IP地址段。大部分商家都是开一个工单 本文已Vultr/BuyVM为例。

### 获取链接信息

#### Vultr

~~应为配置的时候忘记截图了 Vultr的ASN/IP段注册部分简短带过QWQ~~

直接打开如下地址 [Vultr BGP](https://my.vultr.com/bgp/) 填写你的ASN和IP地址段, Vultr会给你的Whois邮箱发送一封验证码邮件, 验证之后等待Vultr的工作人员审核（注意回复工单）。

在申请通过之后, 打开VPS的详情, 点击 `BGP` 选项卡 就可以得到如下信息:

![Vultr BGP](https://s3.pysio.online/pysioimages/20250216154622.png)

至此 你就得到了和Vultr进行BGP Session的信息。

#### BuyVM

登录[BuyVM管理后台](https://manage.buyvm.net/) 选择你的机器 点击 `Networking` -> `BGP` 在提交工单之后, 等待审核通过。就可以得到如下信息:

![BuyVM BGP](https://s3.pysio.online/pysioimages/20250217081432.png)

至此 你就得到了和BuyVM进行BGP Session的信息。

### 配置Bird2

我使用 `Debian 12` 作为示例, 直接使用APT安装Bird2 `apt install bird2`

我的ASN为 `AS213605` 我想宣告 `2a14:67c1:a020::/48`

以Vultr为例, 他给出的对端ASN是 `64515` 对端IP是 `2001:19f0:ffff::1` 我们的 vps 本身的 IPv6 地址为 `2001:19f0:5001:225f:5400:05ff:fe69:6776`, MD5 密码为 114514, 所以我的配置文件如下:

```conf
log syslog all;

router id 114.514.111.222; # vps 的公网 IPv4 地址
define ASN=213605; # 你的 ASN
define OWNIPv6s=[2a14:67c1:a020::/48]; # 你的 IPv6 地址段

# device 协议必须有, 否则 BIRD 不会自动从内核获取比如网络接口的信息, direct 协议和寻找下一跳的时候就挂了
protocol device {}

# kernel 协议用于导出路由表到内核
protocol kernel {
    ipv6 {
        export all; # 将所有 IPv6 路由都导入系统路由表
    };
}

# static 定义静态路由
protocol static static_v6 {
    ipv6;
    route 2a14:67c1:a020::/48 via 2001:19f0:5001:225f:5400:05ff:fe69:6776;  # 宣告 2a14:7c0:4d00::/40 这段 IP, 同时修改via后的ipv为你vps的ipv6
}

filter export_filter_v6 {
    if net ~ OWNIPv6s then accept; # 如果前缀包括在OWNIPv6s内则放出
    reject; # 否则全部拒绝
}

filter import_filter_v6 {
    if net ~ [::/0] then reject; # 如果为默认路由则拒绝
    accept; # 接收所有其他路由
}

protocol bgp vultr {
    local as ASN; # 指定本端ASN
    source address 2001:19f0:5001:225f:5400:05ff:fe49:6493; # 指定本端地址
    multihop 2; # 设置多跳 Vultr提供的值为2
    neighbor 2001:19f0:ffff::1 as 64515; # 指定对端地址与ASN
    ipv6 { # 指定要在该BGP邻居上跑的协议
        import filter import_filter_v6; # 指定导入过滤器
        export filter export_filter_v6; # 指定导出过滤器
        export limit 10; # 限制导出前缀数量, 根据需要调整, 防止过滤器配糊导致 session 爆炸
    };
    password "114514"; # 如果没有 password 删除这行即可
    graceful restart; # 平滑重启, 防止重启bird的时候造成路由撤回导致服务中断
}
```

你可以直接按着我的配置文件修改(建议先去看看soha的教程 然后自己手写[^2]), 改好后写入 `/etc/bird/bird.conf`, 然后应用配置文件 `bridc c`

你可以运行 `birdc show protocols all` 查看当前所有协议的状态: 

```shell
vultr    BGP        ---        up     2025-02-10    Established   
  BGP state:          Established
    Neighbor address: 2001:19f0:ffff::1
    Neighbor AS:      64515
    Local AS:         213605
    Neighbor ID:      45.76.40.105
    Local capabilities
      Multiprotocol
        AF announced: ipv6
      Route refresh
      Graceful restart
        Restart time: 120
        AF supported: ipv6
        AF preserved:
      4-octet AS numbers
      Enhanced refresh
      Long-lived graceful restart
    Neighbor capabilities
      Multiprotocol
        AF announced: ipv6
      Route refresh
      Extended message
      Graceful restart
      4-octet AS numbers
      ADD-PATH
        RX: ipv6
        TX:
      Enhanced refresh
      Long-lived graceful restart
        LL stale time: 0
        AF supported:
        AF preserved: ipv6
      Hostname: ams510.vultr.com
    Session:          external multihop AS4
    Source address:   2001:19f0:5001:225f:5400:5ff:fe49:6493
    Hold timer:       142.836/180
    Keepalive timer:  38.528/60
  Channel ipv6
    State:          UP
    Table:          master6
    Preference:     100
    Input filter:   ACCEPT
    Output filter:  ACCEPT
    Routes:         203065 imported, 2 exported, 203065 preferred
    Route change stats:     received   rejected   filtered    ignored   accepted
      Import updates:        8010300          0          0     204161    7806139
      Import withdraws:      4736940          0        ---        194    4736746
      Export updates:        7806141    7806139          0        ---          2
      Export withdraws:      4736746        ---        ---        ---          0
    BGP Next hop:   2001:19f0:5001:225f:5400:5ff:fe49:6493
    IGP IPv6 table: master6
```

宣告的IP段在全球范围内的转播和收敛需要一点时间, 你可与去干点别的事情, 或者干脆直接睡一觉(如果你是在半夜配置的话)。

等待半小时到一小时后, 可用打开 [BGP Tools](https://bgp.tools/) 输入你的IP段查看全球范围内的转播情况。

![我的Anycast传播情况](https://s3.pysio.online/pysioimages/20250217083854.png)

## 3. 配置网卡

目前我们已经成功地把 `2a14:67c1:a020::/48` 宣告出去了.

此时全球访问 `2a14:67c1:a020::/48` 的流量就已经被路由到我们这台 vps 上了, 不过我们的 vps 现在被配置为什么都不做, 直接返回 unreachable. 我们现在只需要在 vps 上做一些小小的配置就能为全球提供服务了:

```bash
# 创建一个 dummy 网卡
ip link add dev dummy0 type dummy
ip link set dummy0 up

# 选一个喜欢的 IP 地址配置给它
ip addr add dev dummy0 2a14:67c1:a020::1
```

完成后, 我们就可以从自己的电脑上 ping 到 `2a14:67c1:a020::1` 这个地址了.

## 4. Anycast?

现在 你可与参照上面的步骤在多台服务器上配置BGP Session, 然后在每台服务器上配置网卡, 配置相同的IP地址, 就可以实现Anycast了。(对就这么简单)

这样 你的访问会直接去找最近的服务器提供服务, 但是对于中国大陆来说 很可能绕地球一圈就是了。。。

当然如果你有钱, 可以找运营商(或者阿里/腾讯)BOYIP接入

## 参考文章 

[^1]: [Anycast 网络是什么？| Anycast 的工作原理 | Cloudflare](https://www.cloudflare.com/zh-cn/learning/cdn/glossary/anycast-network/)

[^2]: [BIRD 与 BGP 的新手开场](https://soha.moe/post/bird-bgp-kickstart.html)

[自己在家开运营商 Part.2 - 向世界宣告 IP 段 (BGP Session & BIRD)](https://blog.lyc8503.net/post/asn-2-bgp-session/)

[自己在家开运营商 Part.4 - 建立自己的 Anycast 网络](https://blog.lyc8503.net/post/asn-4-anycast-network/)