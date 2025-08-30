---
title: 从0开始注册一个ASN并广播IP - APNIC篇
date: 2025-08-30
icon: fa-light fa-earth-asia
category: daily
tag:
  - BGP
  - 日常
---

> [!warning]
> 本文介绍的是互联网实体 ASN 的注册流程。如需了解 DN42 实验网络中的 ASN 申请流程，请参考[DN42 ASN 申请](https://lantian.pub/article/modify-website/dn42-experimental-network-2020.lantian/)。

> [!warning]
> 如果您作为一个新手 我更建议你前往DN42 申请一个实验网络的ASN进行学习 这篇文章的内容是为了帮助你在真实的互联网中申请一个ASN并广播IP地址

> 本文大部分摘抄自 RIPE NCC 篇章 只对APNIC特色做描述

这是及 [从0开始注册一个ASN并广播IP](https://www.pysio.online/posts/daily/RegistryASN.html) 的系列文章第二篇，介绍如何从APNIC获取一个ASN。

## 1. 基础概念
> RIR: Regional Internet Registry（区域互联网注册管理机构）

ASN 号码和 IP 地址资源的分配遵循严格的国际管理机制。全球互联网资源由五大区域互联网注册管理机构（RIR）进行管理：
- [AFRINIC](https://afrinic.net/)：负责非洲地区
- [ARIN](https://www.arin.net/)：负责北美地区
- [LACNIC](https://www.lacnic.net/)：负责拉丁美洲和加勒比海地区
- [RIPE NCC](https://www.ripe.net/)：负责欧洲、中东和中亚地区
- [APNIC](http://apnic.net/)：负责亚太地区

> LIR: Local Internet Registry（本地互联网注册管理机构）

需要注意的是，RIR 不直接面向终端用户提供服务，而是通过本地互联网注册管理机构（LIR）来分配资源。LIR 作为 RIR 的成员机构，需承担相应的年度会费以维持其成员资格，这对个人用户而言通常并不经济。

## 2. 准备材料
申请 ASN 时，您需要向 LIR 提供以下必要文件 ：

### 身份证明文件
- 企业申请者：有效的企业营业执照或公司注册证明
- 个人申请者：政府颁发的有效身份证明文件

注：若申请人为未成年人，通常需要其法定监护人提供书面同意书并履行相应监护职责。所有提交的文件应确保真实有效，且必须是原件或经过公证的副本。

### 联系信息
- 实体通信地址（用于 WHOIS 数据库登记）
- 技术运维联系邮箱（NOC Email）
- 滥用报告联系邮箱（Abuse Email）

### 现在 填写以下信息 提交给LIR

没错 APNIC 的流程和 RIPE NCC 并不一样，你需要填写以下信息并提交给LIR，并让LIR代为创建键值。你无法直接创建这些键值。

```
person 键值
person： 拼音 姓 名
address: 英文格式地址
country: 国家代码
phone: 电话
e-mail: 电子邮件

MNTNER 键值
mntner: MAINT-名字-CN
descr: 描述
admin-c: person 键值 (你不需要填写)
upd-to: 电子邮件
auth: 更新密码

IRT 键值
IRT: IRT-名字-CN
address: 英文格式地址
e-mail: 电子邮件
abuse-mailbox: 滥用邮箱
admin-c: person 键值(你不需要填写)
tech-c: person 键值(你不需要填写)
auth: 更新密码
```

### 提交资料

> 注意APNIC与RIPE NCC不同 您需要直接将身份信息（身份证/护照/驾照）发送给LIR 由LIR提交

将以上信息提交给LIR之后，LIR会帮你创建这些键值，并与你签订赞助协议，签订之后LIR会将这些信息提交给APNIC，APNIC审核通过之后会分配给你ASN。

~~在这里推销以下我的APNIC LIR服务 如果你需要LIR服务可以联系我 首年¥3000 后续¥500/年~~

## 3. APNIC 特色 Auto DBM

### 3.1 什么是Auto DBM

Auto DMB 是APNIC提供的一个~~自动化~~更新数据库信息的工具，你需要发送邮件到`auto-dbm@apnic.net` 来更新你的数据库信息。

### 3.2 如何使用Auto DBM

Auto DBM 其实非常难用，用过的都说~~不~~好用 你可以自行查阅已下APNIC的文档了解AutoDBM的用法：

[Managing objects in the APNIC Whois Database](https://www.apnic.net/manage-ip/using-whois/updating-whois/objects/)

[Sending updates by email](https://www.apnic.net/manage-ip/using-whois/updating-whois/objects/email-updates/)


## 4. Peering DB 创建/维护

### 1. 什么是PeeringDB?

PeeringDB 就像是互联网世界的"社交名片夹"！想象一下，如果每个网络运营商都是派对上的来宾，PeeringDB 就是那个帮大家互相认识的花名册。在这里，你可以：

- 告诉别人"我是谁"（你的网络信息）
- 说说"我住哪儿"（你的网络设施位置）
- 留下"联系方式"（技术联系信息）
- 展示"交朋友的意愿"（对等互联政策）

简单来说，PeeringDB 是一个全球性的数据库平台，帮助网络运营商、数据中心和互联网交换点（IXP）互相发现并建立连接。它就像是网络世界的 LinkedIn，让大家能够更容易地找到合适的网络伙伴！

**总结：** PeeringDB 是网络运营商用于分享网络信息和建立对等互联关系的重要平台，是 ASN 持有者几乎必备的注册信息库。

### 2. 创建 PeeringDB 账号

前往 [PeeringDB Register](https://www.peeringdb.com/register) 注册账号。不在过多赘述。

**注意:** 在注册PeeringDB时 最好使用你在RIPE DB中创建的role对象的邮箱

### 3. 在 PeeringDB 中关联你的ASN

前往 [PeeringDB Profile](https://www.peeringdb.com/profile) 中的 关联组织 板块 输入你的ASN和组织名称进行关联

![已我自己的ASN举例](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/preeingdb%20link.png)

关联成功之后 你就可以在右上角下拉菜单中找到你的组织了

![接上图](http://s3.pysio.online/pysioimages/peeringdblinkdone.png)

### 4. 修正信息

在上图中，点击进入自己的组织之后，点击右上角的 Edit（编辑按钮） 进入编辑界面， 补充一些信息:

左上角最大的输入框为组织名称 参考RIPE数据库中的org-name 

别名 (可选): 组织的其他名称/简称

长名称 (可选): 组织的全称

地址行 1 (可选): 组织的地址

地址行 2 (可选): 组织的地址

Company Website Override: 组织的网站地址

Suite (可选): 组织的房间号

位置 (可选): 的具体位置

国家和地区代码: 组织所在的国家和地区代码

![放一张13335的例子](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/peeringdborg.png)

### 5. 添加网络

名称: 网络的名称

网站: 网络的网站地址

IRR as-set/route-set 对象: 网络的 IRR as-set/route-set 对象(虽然这是一句废话)

Network Types(可选): 网络类型

流量级别: 传入/传出速率

交通比率: 传入/传出流量比率

地理范围: 网络的地理范围

单播 IPv4 / 多播 / IPv6 ：按照实际情况勾选

政策 URL: 对等政策URL

一般政策: 对等政策状态

合同要求: 对等是否需要合同

Health Check: 网络的状态检查

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/peeringdb%20add%20networks.png)

最后 点击提交网络就完成了

> 因为PeeringDB的界面解释是在多... IX部分就先咕咕咕了

## 5. 现在终于可以着手广播你的IP了!

### 1. 寻找一个上游

各大运营商常在托管机房有接入点, 你可以购买机房的托管服务, 然后就应该可以直接联系运营商签约购买带宽及 IP transit 服务。 但是介于国内特色, 这一套下来你只会收到天价的账单 ~~（当然如果你不差钱就当我没说）~~

但是好消息是, 有很多的VPS商家提供BGP Session服务, 例如Vultr BuyVM等等, 你可以选择其中一个作为你的上游。 这些提供商每月价格大约在5-10美元之间, 性价比还算的过去。

你也可以在这里 [BGP Services](https://bgp.services/) 寻找更多的提供商

### 2. 开始向世界宣告你的IP地址

在开始这个步骤之前, 你应该按照商家的要求, 验证你的ASN和IP地址段。大部分商家都是开一个工单 本文已Vultr为例。

#### 1. 获取链接信息

直接打开如下地址 [Vultr BGP](https://my.vultr.com/bgp/) 填写你的ASN和IP地址段, Vultr会给你的Whois邮箱发送一封验证码邮件, 验证之后等待Vultr的工作人员审核（注意回复工单）。

在申请通过之后, 打开VPS的详情, 点击 `BGP` 选项卡 就可以得到如下信息:

![Vultr BGP](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/20250216154622.png)

至此 你就得到了和Vultr进行BGP Session的信息。

#### 2. 配置Bird2

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

你可以直接按着我的配置文件修改(建议先去看看[soha的教程](https://soha.moe/post/bird-bgp-kickstart.html) 然后自己手写), 改好后写入 `/etc/bird/bird.conf`, 然后应用配置文件 `bridc c`

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

![传播完成!](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/bgptools.png)

#### 3. 配置网卡

目前我们已经成功地把 `2a14:67c1:a020::/48` 宣告出去了.

此时全球访问 `2a14:67c1:a020::/48` 的流量就已经被路由到我们这台 vps 上了, 不过我们的 vps 现在被配置为什么都不做, 直接返回 unreachable. 我们现在只需要在 vps 上做一些小小的配置就能为全球提供服务了:

```bash
# 创建一个 dummy 网卡
ip link add dev dummy0 type dummy
ip link set dummy0 up

# 选一个喜欢的 IP 地址配置给它
ip addr add dev dummy0 2a14:67c1:a020::1
```
