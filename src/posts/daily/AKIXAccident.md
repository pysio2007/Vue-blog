---
title: AKIX 事故合订本
date: 2025-05-26
icon: fa-kit fa-wireshark
category: daily
tag:
  - BGP
  - 日常
---

## 1. 哥们 你的下一跳怎么是上游

[2025/5/15 原始帖子](https://pysio.blog/notes/a7u2jlwwrd490031)

在群友帮AS208754琢磨了2后，发现他的下一条竟然是上游！

```text
 我这个前缀为什么没有导出到上游啊, 上游  Import 0
 群友: 你实在不行  all  以下试一试 
 好
 上游:  Import 0
 群友: 起了怪了 你试一试xxxx
```

结果他的Bird Config是这样的：

```conf
protocol static {
    ipv6;
    route 打马::/44 via fd00:2::1
}
```

好的 让我们来解释以下发生了什么:

在这个 BGP 会话中 `fd00:2::1` 是上游的地址，很明显他静态指定了下一跳的路由为上游地址，这样就造成了环路 Bird 当然罢工啦！

## 2. 巨量撤回更新

[2025/5/22 原始帖子](https://pysio.blog/notes/a81vh2qounpi0033) 

因为BuyVM的抽象LU网络 导致了巨量的撤回更新，如下文: 

```bash
    Routes:         1 imported, 213789 exported, 1 preferred
    Route change stats:     received   rejected   filtered    ignored   accepted
      Import updates:           6295          0          0          5       6290
      Import withdraws:            0          0        ---          0       6289
      Export updates:     1340353503      12530      19382        --- 1340321591
      Export withdraws:        16719        ---        ---        ---       9950
```

## 3. DN42 IP麦当劳随心配

[2025/5/22 原始帖子](https://pysio.blog/notes/a8346q5ounpi004y) 

群内 大伙在帮 @Alice_8585@baka.ink 琢磨他的BGP配置为什么没有正确导出IPv4前缀的时候 看到了如此的WireGuard配置:

```bash
3: pyiso: <POINTOPOINT,NOARP,UP,LOWER_UP> mtu 1420 qdisc noqueue state UNKNOWN group default qlen 1000
    link/none
    inet 172.20.44.131 peer 172.20.183.3/32 scope global pyiso
       valid_lft forever preferred_lft forever
    inet6 fe80::440/64 scope link
       valid_lft forever preferred_lft forever
4: lezi: <POINTOPOINT,NOARP,UP,LOWER_UP> mtu 1420 qdisc noqueue state UNKNOWN group default qlen 1000
    link/none
    inet 172.20.44.132 peer 172.22.137.99/32 scope global lezi
       valid_lft forever preferred_lft forever
    inet6 fe80::387/64 scope link
       valid_lft forever preferred_lft forever
```

大伙发现哪里出现了问题吗？ 对啦！他给不同的WireGuard隧道配置了不同的IP地址，这在DN42当中是不被允许的。。

::: details 附上STE的一篇帖子

你的意思是，我们ping不通，一边一遍遍检查birdc，bird.conf，BGP状态，都快怀疑你那边网络是不是宇宙射线持续照射翻转了bit导致数据包爆炸，而你那边的WireGuard peer填了一个随机IP？

你的意思是，BIRD 配置里邻居地址写着一个IP地址，WireGuard配置里又是另一个，另一个接口上挂着的又是另一个，然后你说辙没什么问题，让我们debug的时候像在猜灯谜？

你的意思是，你把wireguard的隧道当成了迷宫玩？让我们连 traceroute 都像是在探测未知宇宙？

这不是一般的隧道了，是随机地址生成器，IETF 来了都解释不了为啥你 BGP 起不来。

8585的 WireGuard 接口、配置文件和 BIRD 的邻居 IP 配置，三者使用了三个不同的 IP，这是我们排查网络联通问题时耽误大量时间的主要原因。

VPN 尤其是 WireGuard 这种P2P协议，对双方 IP 的一致性要求是非常严格的。它不像普通的以太网那样靠广播来兜底，IP 配错就等于彻底断链，后面的任何调优都是徒劳。

建议今后配置 VPN 和 BIRD 相关的接口地址时，将所有详细信息paste到某个网站上，以此大大节省排障成本。

互联网真是太好玩了

:::

## 4. WireGuard 在睡觉！

[2025/5/23 原始帖子](https://pysio.blog/notes/a839ueoounpi005f)

没错 在我们研究了半个小时为什么WireGuard隧道不通的时候，随手的一个Ping 发现能ping通。。。

这件事情告诉我们不要看WireGuard的last handshake来判断是否握手 因为很有可能他在偷懒。

你随便发个数据包他就开始干活了 非常神奇

## 5. 哥们，你的route6呢？

还是AS208754，在发现自己的/48段ping不通后来群里求助

```text
 111我这个/48怎么全国ping不通啊是不是被gfw墙了
 群友: 你是干了什么伤天害理的事情让gfw墙你/48
 那怪了
 （长时间的调试）
 上游:  Import 0
 上游：你route6呢？
```

经过群友的解释，原来当天只给/48配了rdns没配route6，过滤器一看蒙圈了，所以被filter了。

这件事告诉我们什么，在配东西之前一定要看仔细，核对好了再整，不要盲目的就直接进生产环境。
