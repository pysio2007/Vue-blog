---
title: 从0开始注册一个ASN并广播IP
date: 2025-04-30
icon: fa-light fa-earth-asia
category: daily
tag:
  - BGP
  - 日常
---

> [!warning]
> 本文介绍的是互联网实体 ASN 的注册流程。如需了解 DN42 实验网络中的 ASN 申请流程，请参考[DN42 ASN 申请](https://lantian.pub/article/modify-website/dn42-experimental-network-2020.lantian/)。

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
在选择 RIR 时，RIPE NCC 之所以受到广泛推荐，主要基于以下三个方面的考虑：

1. 成本效益：RIPE NCC 的注册费用相对合理。相比之下，APNIC 的基础费用要高出约 30%，且存在额外的管理成本。
2. 系统便利性：RIPE NCC 提供完善的在线管理系统，用户可以自主完成进度查询、配置修改等操作。而 APNIC 的部分流程仍依赖邮件沟通，在效率方面相对较低。
3. 政策稳定性：RIPE NCC 的政策调整较为温和且可预期，这与其他一些区域性机构相比具有明显优势。

综上所述，基于现有资料分析，RIPE NCC 是个人申请 ASN 较为理想的选择，其次是 APNIC 或 ARIN。

## 2. 准备材料
申请 ASN 时，您需要向 LIR 提供以下必要文件（以 RIPE NCC 注册为例）：

### 身份证明文件
- 企业申请者：有效的企业营业执照或公司注册证明
- 个人申请者：政府颁发的有效身份证明文件

注：若申请人为未成年人，通常需要其法定监护人提供书面同意书并履行相应监护职责。所有提交的文件应确保真实有效，且必须是原件或经过公证的副本。

### 联系信息
- 实体通信地址（用于 WHOIS 数据库登记）
- 技术运维联系邮箱（NOC Email）
- 滥用报告联系邮箱（Abuse Email）

### 技术要求证明
- 位于欧洲区域内的 BGP 服务提供商出具的最近两个月内有效账单或合同
- 至少两个已确认的 BGP 上游提供商

### RIPE DB 账户和条目创建

#### 1. 注册 RIPE NCC Access 账号

打开 [RIPE DataBase](https://access.ripe.net/registration) 注册界面 完成注册。不多赘述

#### 2. 创建初始 role 和 maintainer (mntner) 对象

打开 [RIPE DB Create Role And MNT](https://apps.db.ripe.net/db-web-ui/webupdates/create/RIPE/role/self)

role 对象是对由一个或多个人执行的角色的抽象，例如表示您用来处理网络事件的部门。

maintainer 对象是对维护者的抽象，记录了维护者的认证信息。其他对象通过 mnt-by 属性授权由谁维护。

在通过以上链接创建 role 和 maintainer 对象时，您需要填写：

- ` mntner `: maintainer 对象的标识符，可包含大小写字母、数字和 _-，例如: YOURNOC-MNT
- ` role `: role 对象的名称，可包含大小写字母、数字和 ][)(._"*@,&:!'`+/-例如: YOURCOMPANY NOC
- ` address `: 此 role 的办公地址
- ` e-mail `: 此 role 的电子邮件联系地址

![用Akaere NetWork举例填写的信息](https://s3.pysio.online/pysioimages/Create%20role%20and%20maintainer%20pair.png)

填写完成后点击 SUBMIT 按钮，将同时创建一个 role 和一个 mntner 对象。

图中红框部分则为 role 对象的主键。您需要将其作为您 AS 的 admin-c / tech-c / abuse-c 提交给您的 LIR

![](https://s3.pysio.online/pysioimages/Create%20role%20and%20maintainer%20pair%20done.png)

#### 3. 设置滥用通知邮箱

在[RIPE DB Query](https://apps.db.ripe.net/db-web-ui/query)顶部的搜索框中填写上节中 role 对象的主键，点击右侧查找按钮。接下来点击搜索结果右上角的 Update object 按钮跳转至修改页面。

![](https://s3.pysio.online/pysioimages/Edit%20Abuse.png)

点击 e-mail 栏右侧 + 号按钮为此 role 对象添加 abuse-mailbox 属性。

![](https://s3.pysio.online/pysioimages/Edit%20Abuse%202.png)

![](https://s3.pysio.online/pysioimages/Edit%20Abuse%203.png)

在出现的 abuse-mailbox 栏中填写滥用通知邮箱后点击 SUBMIT 按钮保存。

![](https://s3.pysio.online/pysioimages/Edit%20Abuse%204.png)

> RIPE NCC 会检查此邮箱的有效性，务必真实可用

#### 4. 创建 organisation 对象

organisation 对象是对公司、非营利团体或个人的抽象，所有其他资源都与该对象相关。是管理 RIPE 数据库中数据的起点。

通过[RIPE DB Create Organisation](https://apps.db.ripe.net/db-web-ui/webupdates/create/RIPE/)创建 organisation 对象时，您需要填写：

- ` mnt-by` : 由谁管理，默认自动填充此前新建的 mntner 的标识符
- ` organisation` : organisation 对象的标识符，默认填充 AUTO-1 将由系统自动生成标识符
- ` org-name `: 此 organisation 的名称，必须填写组织的法定全称或个人姓名之一
- ` address` : 此 organisation 的联系地址，必须是组织的法定地址或个人住址之一
- ` e-mail `: 此 organisation 的电子邮件联系地址
- ` abuse-c `: 此 organisation 的滥用通知联系方式，必须指向具有 abuse-mailbox 属性的 role 对象
- ` mnt-ref `: 谁可引用此 organisation，被指向的 mntner 可以添加指向此 organisation 的对象，即由谁为此组织分配资源，询问您的 LIR 以获得具体值

![](https://s3.pysio.online/pysioimages/Creat%20organisation.png)

填写完成后点击 SUBMIT 按钮，页面中上位置以 organisation "ORG-EXAMPLE-RIPE" 字样展示了 organisation 对象的标识符(图中红色方框部分)，您需要将其作为您 AS 的 org 提交给您的 LIR。

![](https://s3.pysio.online/pysioimages/Creat%20organisation%20Done.png)

#### 4.1 如果刚刚有地方出错了 如何修改？

当你发现上面有内容写错的时候 前往[RIPE DB Query](https://apps.db.ripe.net/db-web-ui/query) 搜索你需要修正的对象的主键，点击右上角的 Update object 按钮跳转至修改页面。

![](https://s3.pysio.online/pysioimages/RIPEUPDATE1.png)

进入修改页面后，修正你需要修改的内容，点击 SUBMIT 按钮提交。

![](https://s3.pysio.online/pysioimages/RIPEUPDATE2.png)

完成之后 RIPE 数据库会显示你修改了内容至此修改结束

![](https://s3.pysio.online/pysioimages/RIPEUPDATE3.png)

#### 5.提交资料

你需要把以下资料提供给LIR 

- 公司注册证书 / 护照（中国居民身份证）正反面
- RIPE NCC 服务区内的网络活动证明（例如欧洲 VPS 的账单）
- AS 的活动地区（国家）
- as-name（AS 名称，例如 CHINATELECOM-CORE-WAN-CN2）
- org（第 4 节，organisation 对象标识符）
- admin-c（第 2 节，role 对象主键）
- tech-c（第 2 节，role 对象主键）
- abuse-c（第 2 节，role 对象主键）
- mnt-by（第 2 节，mntner 对象标识符

## 3. Peering DB 创建/维护

### 1. 什么是PeeringDB?

PeeringDB 就像是互联网世界的"社交名片夹"！想象一下，如果每个网络运营商都是派对上的来宾，PeeringDB 就是那个帮大家互相认识的花名册。在这里，你可以：

- 告诉别人"我是谁"（你的网络信息）
- 说说"我住哪儿"（你的网络设施位置）
- 留下"联系方式"（技术联系信息）
- 展示"交朋友的意愿"（对等互联政策）

简单来说，PeeringDB 是一个全球性的数据库平台，帮助网络运营商、数据中心和互联网交换点（IXP）互相发现并建立连接。它就像是网络世界的 LinkedIn，让大家能够更容易地找到合适的网络伙伴！

**总结：** PeeringDB 是网络运营商用于分享网络信息和建立对等互联关系的重要平台，是 ASN 持有者几乎必备的注册信息库。

> Todo: 剩下的部分下号了继续写