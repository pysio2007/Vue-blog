---
title: Migrating from WordPress to VuePress
date: 2024-10-21
icon: fa-brands fa-vuejs
category: daily
tag:
  - WordPress
  - Daily
---

## Introduction: Why Migrate?

For the past year or so, I've been using WordPress as my blog system, but my small server is really too weak to handle WordPress, this big guy. So I decided to migrate to VuePress.

## Starting the Migration

Initially, I looked at many static site generators like Hexo, Hugo, Jekyll, and finally chose [VuePress Theme Hope](https://theme-hope.vuejs.press/).

So let's start migrating!

## Installing VuePress Theme Hope

First, install Node.js 18.0.0+

### Then create the project template

```bash
npm init vuepress-theme-hope@latest my-docs
```

Here, my-docs is a parameter representing the folder name of the VuePress Theme Hope project.

After executing the command, follow the prompts and use the keyboard ↓ to select Simplified Chinese and press Enter to make selections as needed.

### Project Commands

```bash
# Start development server
npm docs:dev
# Build project and output
npm docs:build
# Clear cache and start development server
npm docs:clean-dev
```

Start the project and visit [http://localhost:8080/](http://localhost:8080/) in your browser to see the effect

### Directory Structure

```
.
├── .github (optional) → GitHub configuration file storage path
│    └── workflow → GitHub workflow configuration
│         └── docs-deploy.yml → Workflow for automatic documentation deployment
│
├── src → Documentation folder
│    │
│    ├── .vuepress (optional) → VuePress configuration folder
│    │    │
│    │    ├── dist (default) → Build output directory
│    │    │
│    │    ├── public (optional) → Static resource directory
│    │    │
│    │    ├── styles (optional) → For storing style-related files
│    │    │
│    │    ├── config.{js,ts} (optional) → Configuration file entry point
│    │    │
│    │    └── client.{js,ts} (optional) → Client file
│    │
│    ├── ... → Other project documentation
│    │
│    └── README.md → Project homepage
│
└── package.json → Node.js configuration file

```

### Next, Make Some Personalized Configurations

### Homepage Image Full Screen Setting

If you don't want the homepage image to be full screen, open README.md, find heroFullScreen and change it to false

```markdown
heroFullScreen: false
```

Effect: 

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/blogdemo.webp)

### Homepage Project Settings

The initialization will generate the following content by default. How do you modify it to your own projects?

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/defpoj.webp)

Open ```README.md```, find ```projects```, and edit it to your desired content.

```markdown
projects:
  - icon: project
    name: Project Name
    desc: Detailed project description
    link: https://your-project-link

  - icon: link
    name: Link Name
    desc: Detailed link description
    link: https://link-address

  - icon: book
    name: Book Name
    desc: Detailed book description
    link: https://your-book-link

  - icon: article
    name: Article Name
    desc: Detailed article description
    link: https://your-article-link

  - icon: friend
    name: Partner Name
    desc: Detailed partner introduction
    link: https://your-partner-link

  - icon: /logo.svg
    name: Custom Project
    desc: Custom detailed introduction
    link: https://your-custom-link
```

If you don't want to display it, just delete all the ```projects``` content. Effect as shown:

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/blognopoj.webp) 