---
title: Current Blog Architecture
date: 2024-11-24
icon: fa-solid fa-screwdriver-wrench
category: develop
tag:
- Blog Development
---

## Main Site Framework

Using framework [Vuepress-Theme-Hope](https://github.com/vuepress-theme-hope/vuepress-theme-hope/)

## Image/Avatar/Font Distribution

All files are distributed using [Pysio-Files-API](https://github.com/pysio2007/Files-API/)

Fonts use [Font Awesome](https://fontawesome.com/) with [custom icons](https://www.pysio.online/posts/develop/icon.html) added

Images are stored in repository [pysio2007/Imges](https://github.com/pysio2007/Imges)

Avatars are automatically fetched and updated using Github Actions in repository [pysio2007/Avatar-To-Img](https://github.com/pysio2007/avatar-to-img)

## Analytics Scripts

[Cloudflare Browser Insights](https://www.cloudflare.com/)

[Umami](https://umami.is/)

## Web Hosting and Distribution

Currently, the website is deployed in 2 places: self-built cluster and [Cloudflare Pages](https://pages.cloudflare.com/) ~~All traffic is distributed by Cloudflare~~

EDIT: Due to self-built Anycast network, the website is now distributed by Anycast cluster 