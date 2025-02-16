---
title: 记一次AnyCast+博客搭建
date: 2025-02-15
icon: fa-solid fa-router
category: daily
article: false
tag:
  - BGP
  - 日常
---

> 本文目前正在施工QWQ

因为闲着没事干，就打算搭建一个Anycast 然后把博客和DNS都放上去，本文暂且记录一下Anycast+博客的搭建过程。

## Anycast 是什么?

> Anycast 是一种网络寻址和路由方法，可以将传入请求路由到各种不同的位置或"节点"。在 CDN 的上下文中，Anycast 通常会将传入的流量路由到距离最近并且能够有效处理请求的数据中心。选择性路由使 Anycast 网络能够应对高流量、网络拥塞和 DDoS 攻击。[^1]

## 前提条件

- 一个ASN
- 一个IPv4/6地址段 
- 多台可BGP Session的服务器 (如果可以 使用多个上游)
- 一个聪明的头脑
- ~~当然 还有一杯咖啡~~

## 1. 寻找一个上游

各大运营商常在托管机房有接入点, 你可以购买机房的托管服务, 然后就应该可以直接联系运营商签约购买带宽及 IP transit 服务。 但是介于国内特色，这一套下来你只会收到天价的账单~~（当然如果你不差钱就当我没说）~~

但是好消息是，有很多的VPS商家提供BGP Session服务，例如Vultr BuyVM等等，你可以选择其中一个作为你的上游。 这些提供商每月价格大约在5-10美元之间，性价比还算的过去。

你也可以在这里 [BGP Services](https://bgp.services/) 寻找更多的提供商

## 2. 宣告地址

在开始这个步骤之前，你应该按照商家的要求，验证你的ASN和IP地址段。大部分商家都是开一个工单 本文已Vultr/BuyVM为例。

### Vultr

~~应为配置的时候忘记截图了 Vultr的ASN/IP段注册部分简短带过QWQ~~

直接打开如下地址 [Vultr BGP](https://my.vultr.com/bgp/) 填写你的ASN和IP地址段，Vultr会给你的Whois邮箱发送一封验证码邮件，验证之后等待Vultr的工作人员审核（注意回复工单）。

在申请通过之后，打开VPS的详情，点击 `BGP` 选项卡 就可以得到如下信息:

![Vultr BGP](https://files.pysio.online/Images/20250216154622.png)

至此 你就得到了和Vultr进行BGP Session的信息。

### BuyVM



## 引用文章 

[^1]: [Anycast 网络是什么？| Anycast 的工作原理 | Cloudflare](https://www.cloudflare.com/zh-cn/learning/cdn/glossary/anycast-network/)