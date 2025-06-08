---
title: Windows下可用的Whois工具
date: 2025-06-09
icon: fa-solid fa-magnifying-glass
category: daily
tag:
  - BGP
  - 工具
---

在Windows下一直找不到一个好用的whois工具，于是我写了一个小别致工具 现在一个在Winget获取 

```powershell
winget install Akaere.whois
```

那么 来介绍一下这个whois工具吧

## 主要功能特色

### 🎨 智能彩色输出
工具会自动检测输出格式并应用对应的配色方案：

- **RIPE格式**: AS号码显示为亮红色，网络信息显示为亮青色，组织联系人显示为亮绿色
- **BGP.tools格式**: 表格标题加粗显示，AS号码、IP地址等使用不同颜色区分

### 🔗 终端超链接支持
默认为所有RIR（区域互联网注册机构）数据库结果启用可点击链接：

- 支持所有主要RIR：RIPE、ARIN、APNIC、LACNIC、AFRINIC
- AS号码、IP网段、组织信息等都可点击
- 兼容现代终端：Windows Terminal、PowerShell、iTerm2等

### 🌐 DN42网络支持
专门支持DN42网络查询：

- 自动检测DN42 AS号（AS42424xxxxx开头）
- 支持手动启用DN42模式

## 示例指令

### 查询IP地址

```powershell
whois 8.8.8.8
```

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/whoisgoogle.png)

### 查询AS号

```powershell
whois AS213605
```

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/whoispysio.png)

### 查询DN42 AS号

```powershell
whois 213605  # 默认行为下 如果一个ASN DN42和公网都存在 则DN42为纯数字 带AS的为公网
```
注: DN42的 Hyperlink还有点问题 会在下个版本修复

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/whoisdn42.png)

### 终端超链接展示

因为局限性 还是得大伙试了才知道（x

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/hyperlinkgoogle.png)

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/hyperlinkasn.png)

最后 放一个Github地址 欢迎Star~ 

[Akaere-NetWorks/whois](https://github.com/Akaere-NetWorks/whois)