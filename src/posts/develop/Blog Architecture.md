---
title: 博客目前的架构
date: 2024-11-24
icon: fa-solid fa-screwdriver-wrench
category: develop
tag:
- 博客开发
---

## 主站框架

使用框架 [Vuepress-Theme-Hope](https://github.com/vuepress-theme-hope/vuepress-theme-hope/)

## 图片/头像/字体 分发

所有文件使用 [Pysio-Files-API](https://github.com/pysio2007/Files-API/) 分发

字体使用 [Font Awesome](https://fontawesome.com/) 添加 [自定义图标](https://www.pysio.online/posts/develop/icon.html) 

图片存放在仓库 [pysio2007/Imges](https://github.com/pysio2007/Imges)

头像使用 Github Actions 自动获取并更新 仓库 [pysio2007/Avatar-To-Img](https://github.com/pysio2007/avatar-to-img)

## 分析脚本

[Cloudflare Browser Insights](https://www.cloudflare.com/)

[Umami](https://umami.is/)

## 网页托管和分发

目前 网站部署在2个地方 分别是 自建集群 和 [Cloudflare Pages](https://pages.cloudflare.com/) ~~所有流量均由 Cloudflare 分发~~

EDIT: 因自建Anycast网络，目前网站由Anycast集群分发