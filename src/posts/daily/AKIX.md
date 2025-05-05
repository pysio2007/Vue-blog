---
title: 组建一个IXP的小计
date: 2025-05-05
icon: fa-solid fa-ethernet
category: daily
tag:
  - BGP
  - 日常
---

ASN拿到手已经三个月了，前阵子也没怎么折腾。最近纯粹是心血来潮，突然想试试能不能自己搭个IXP。

## 为什么要折腾IXP？

说实话，最初的动力很简单，就是想玩。BGP、RPKI这些词看着高大上，实际动手才发现，原来自己也能搞起来。顺便还能帮朋友们的网络互联省点事，何乐而不为？

- 想深入理解BGP和RPKI，光看文档不过瘾，必须实操
- 让小网络也能低门槛互联，体验"互联网的互联网"
- 顺便试试远程虚拟接入，看看能不能让地球另一端的朋友也能轻松接入

## 技术选型和踩坑

一开始就没打算搞得多复杂，能跑起来、能互联、能安全就行。

- 路由软件选了Bird，轻量好用，配置也不难
- 交换用VXLAN，省得折腾物理交换机，远程接入也方便
- RPKI自己搭了个RTR服务器，安全感up
- 服务器放在法兰克福，欧洲网络资源丰富，延迟也不错

最头疼的其实是远程虚拟接入，毕竟不是每个人都能去机房插根网线。VXLAN帮了大忙，大家只要有公网VPS就能拉隧道进来。

## 动手搭建的流水账

### 1. 服务器和网络

先搞了一台支持BGP的VPS，申请了IPv6段`2a14:67c1:a080::/48`。IPv4太贵，IPv6用起来真香。

```bash
# 创建IXP VXLAN接口
ip link add vxlan0 type vxlan id 10 dstport 4789 local 2a05:f480:1800:2e75:5400:05ff:fe65:88f3
ip addr add 2a14:67c1:a080::1/64 dev vxlan0
ip link set vxlan0 up
```

### 2. Bird配置

Bird是核心，负责BGP路由交换。配置其实没想象中复杂，主要就是ASN过滤、RPKI校验、模板化加对等体。

```conf
router id 136.244.83.121;

# 定义BOGON ASN过滤
define BOGON_ASNS = [
    0, 23456, 64496..64511, # ... 其他BOGON ASN
];

define IX_PEERS = [
    213605, 213891, 151194, 198025, 210352
];

function ix_import() {
    if bgp_path.last ~ BOGON_ASNS then return false;
    if !check_roa_v6() then return false;
    return true;
}
```

模板化配置，后续加成员很方便：

```conf
template bgp ix_rs {
    local as 210440;
    multihop 2;
    ipv6 {
        import where ix_import();
        export where ix_export();
        next hop self;
        graceful restart on;
    };
}
```

### 3. RPKI验证

安全这块不能省，自己搭了RPKI验证器，Cloudflare也拉了个备份。

```conf
protocol rpki rpki_akae {
    roa4 { table roa_table_v4; };
    roa6 { table roa_table_v6; };
    remote "rpki.akae.re" port 8282;
    retry keep 90;
    refresh keep 43200;
    expire keep 86400;
}

protocol rpki rpki_cloudflare {
    roa4 { table roa_table_v4; };
    roa6 { table roa_table_v6; };
    remote "rtr.rpki.cloudflare.com" port 8282;
    retry keep 90;
    refresh keep 43200;
    expire keep 86400;
}

function check_roa_v6() {
    case roa_check(roa_table_v6, net, bgp_path.last) {
        ROA_VALID: return true;
        ROA_UNKNOWN: return true;
        ROA_INVALID: return false;
    }
}
```

### 4. PeeringDB注册

搭好后顺手在PeeringDB挂了个号：

- 组织：AKAERE NETWORKS TECHNOLOGY LTD
- 别名：Akaere IX
- 位置：CN
- 地域：亚太地区
- 服务级别：工作时间
- 网站：[ixpm.akae.re](https://ixpm.akae.re/)

## 运营小记

目前已经有几个朋友的网络接入了Akaere IX，大家一起玩BGP、测路由、折腾RPKI。带宽和规模其实都不是重点，关键是能互联、能交流、能一起成长。

### 遇到的坑

- VXLAN偶尔抽风，隧道不稳，得多监控
- 每个成员的路由策略都不一样，配置得灵活点

### 技术收获

- BGP路由控制和策略玩法，实际操作比看书有趣多了
- RPKI部署和异常处理，安全感拉满
- VXLAN跨地域二层网络，远程接入so easy
- 自动化脚本管理，省心不少

## 后续想法

Akaere IX还在慢慢完善，未来想：

- 多接点，覆盖更多地区
- 自动化和可视化做得更好
- 路由安全服务再丰富点
- 也许还能和别的IXP互联玩玩

## 总结

这次折腾IXP，收获的不只是技术，更是和一群同样热爱网络的朋友一起成长的乐趣。互联网的本质就是开放和连接，IXP只是一个小小的缩影。

如果你也想玩BGP、想体验网络互联，欢迎来找我（team@akae.re），一起折腾！

---

**技术参考：**

- [BIRD路由软件文档](https://bird.network.cz/)
- [RPKI部署指南](https://rpki.readthedocs.io/)
- [VXLAN技术介绍](https://datatracker.ietf.org/doc/rfc7348/)