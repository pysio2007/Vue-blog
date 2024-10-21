---
title: 从WordPress迁移到VuePress
date: 2024-10-21
icon: fa-brands fa-vuejs
category: daily
tag:
  - WordPress
  - 日常
---

## 开篇 为什么要迁移？

在过去的1年多 我都使用WordPress 作为我的博客系统，但是我手上的小鸡实在是太弱了，实在是带不动WordPress这个大家伙，所以我决定迁移到VuePress上来。

## 开始迁移

最开始 我看了很多静态资源生成系统，比如Hexo、Hugo、Jekyll，最后我选择了[VuePress Theme Hope](https://theme-hope.vuejs.press/)。

那么开始迁移吧！

## 安装VuePress Theme Hope

首先 安装 Node.js 18.0.0+

### 然后创建项目模板

```bash
npm init vuepress-theme-hope@latest my-docs
```

这里的 my-docs 是一个参数，代表 VuePress Theme Hope 项目的文件夹名称。

执行完命令后根据提示，通过键盘 ↓ 选择 简体中文 并回车来按需选择。

### 项目命令

```bash
# 启动开发服务器
npm docs:dev
# 构建项目并输出
npm docs:build
# 清除缓存并启动开发服务器
npm docs:clean-dev
```

启动项目，浏览器输入 [http://localhost:8080/](http://localhost:8080/) 查看效果

### 目录结构

```
.
├── .github (可选的) → GitHub 配置文件存放路径
│    └── workflow → GitHub 工作流配置
│         └── docs-deploy.yml → 自动部署文档的工作流
│
├── src → 文档文件夹
│    │
│    ├── .vuepress (可选的) → VuePress 配置文件夹
│    │    │
│    │    ├── dist (默认的) → 构建输出目录
│    │    │
│    │    ├── public (可选的) → 静态资源目录
│    │    │
│    │    ├── styles (可选的) → 用于存放样式相关的文件
│    │    │
│    │    ├── config.{js,ts} (可选的) → 配置文件的入口文件
│    │    │
│    │    └── client.{js,ts} (可选的) → 客户端文件
│    │
│    ├── ... → 其他项目文档
│    │
│    └── README.md → 项目主页
│
└── package.json → Nodejs 配置文件

```

### 接下来 做一些个性化的配置

### 首页图片全屏设置

如果不想首页图片全屏,，打开README.md找到heroFullScreen修改为fasle

```markdown
heroFullScreen: false
```

效果： 

![](https://imges.pysio.online//blogdemo.webp)

### 首页项目设置

初始化是会默认生成以下内容，如果要修改为自己的项目要怎么修改呢。

![](https://imges.pysio.online//defpoj.webp)

打开```README.md```，找到```projects```，编辑成你要的内容即可。

```markdown
projects:
  - icon: project
    name: 项目名称
    desc: 项目详细描述
    link: https://你的项目链接

  - icon: link
    name: 链接名称
    desc: 链接详细描述
    link: https://链接地址

  - icon: book
    name: 书籍名称
    desc: 书籍详细描述
    link: https://你的书籍链接

  - icon: article
    name: 文章名称
    desc: 文章详细描述
    link: https://你的文章链接

  - icon: friend
    name: 伙伴名称
    desc: 伙伴详细介绍
    link: https://你的伙伴链接

  - icon: /logo.svg
    name: 自定义项目
    desc: 自定义详细介绍
    link: https://你的自定义链接
```

如果不想显示，直接把```projects```的内容全部删除即可，效果如图：

![](https://imges.pysio.online//blognopoj.webp)
