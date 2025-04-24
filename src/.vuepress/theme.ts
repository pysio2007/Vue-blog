import { hopeTheme } from "vuepress-theme-hope";
import gitDescribe from 'git-describe';
import navbar from "./navbar.js";
import sidebar from "./sidebar/index.js";
import fs from 'fs';
import path from 'path';
import { meilisearchPlugin } from '@vuepress/plugin-meilisearch'

//Git Hash
const gitInfo = gitDescribe.gitDescribeSync();
const gitHash = gitInfo.hash.startsWith('g') ? gitInfo.hash.slice(1) : gitInfo.hash;
process.env.VUE_APP_GIT_HASH = gitHash;

const calculateRunTime = () => {
  const startDate = new Date('2024-10-02T19:28:00+08:00');
  const buildDate = new Date();  // 使用编译时的时间
  const diff = buildDate.getTime() - startDate.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${days}天${hours}小时`;
};

const envFilePath = path.resolve(__dirname, '../../.env');
let anycastValue = 'CloudFlare';

if (fs.existsSync(envFilePath)) {
  const envFileContent = fs.readFileSync(envFilePath, 'utf-8');
  const envVars: { [key: string]: string } = envFileContent.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {} as { [key: string]: string });

  anycastValue = envVars.VUE_APP_ANYCAST || 'CloudFlare';
}

export default hopeTheme({
  hostname: "https://www.pysio.online",

  darkmode: "switch",

  author: {
    name: "Pysio",
    url: "https://github.com/pysio2007/",
  },

  logo: "https://www.pysio.online/assets/imgs/avast.svg",

  repo: "pysio2007/Vue-blog",

  docsDir: "src",

  //Docs Repo
  contributors: false,
  changelog: false,
  editLink: false,

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: `Pysio's Home / <a href="https://beian.miit.gov.cn/" target="_blank" style="color: inherit; text-decoration: none; font-weight: normal;">蜀ICP备2023021309号-1</a> / <a href="https://beian.mps.gov.cn/#/query/webSearch" target="_blank" style="color: inherit; text-decoration: none; font-weight: normal;">川公网安备51010802032524号</a> / <a href="https://github.com/pysio2007/Vue-blog/commit/${process.env.VUE_APP_GIT_HASH}" target="_blank" style="color: inherit; text-decoration: none; font-weight: normal;">${process.env.VUE_APP_GIT_HASH}</a> / 本站已稳定运行${calculateRunTime()} `,
  displayFooter: true,

  // 博客相关
  blog: {
    description: "一只懒懒的熊猫",
    intro: "/intro.html",
    medias: {
      BiliBili: "https://space.bilibili.com/87983450",
      Email: "mailto:team@pysio.online",
      GitHub: "https://github.com/pysio2007/",
      Steam: "https://steamcommunity.com/profiles/76561198412338808/",
      AFDian: "https://mbd.pub/o/author-bGubmmpoZg==",
    },
    articleInfo: ["Author", "Original", "Date", "PageView", "Category", "Tag", "ReadingTime"],
  },

  // 加密配置
  encrypt: {
    config: {
      "/tools/mcmod.html": ["mcmod"],
    },
  },

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  hotReload: true,

  markdown: {
    align: true,
    attrs: true,
    component: true,
    demo: true,
    include: true,
    mark: true,
    plantuml: true,
    spoiler: true,
    alert: true,
    hint: true,
    math: true,
    codeTabs: true,
    footnote: true,
    stylize: [
      {
        matcher: "Recommended",
        replacer: ({ tag }) => {
          if (tag === "em")
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
        },
      },
    ],
    sub: true,
    sup: true,
    tasklist: true,
    vPre: true,

    // 在启用之前安装 chart.js
    chartjs: true,

    // markdownMath: {
    //   // 启用前安装 katex
    // type: "katex",
    //   // 或者安装 mathjax-full
    //   type: "mathjax",
    // },

    // 在启用之前安装 echarts
    echarts: true,

    // 在启用之前安装 flowchart.ts
    flowchart: true,

    // gfm requires mathjax-full to provide tex support
    // gfm: true,

    // 在启用之前安装 mermaid
    mermaid: true,

    playground: {
      presets: ["ts", "vue"],
    },

    // 在启用之前安装 @vue/repl
    vuePlayground: true,

    // 图片相关配置
    figure: true,
    imgLazyload: true,
    imgMark: true,
    imgSize: true,
    obsidianImgSize: true,


    // 代码高亮
    highlighter: {
      type: "prismjs",
      themes: { light: 'one-light', dark: 'nord' },
      lineNumbers: false,
    },

    // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
    revealjs: {
      plugins: ["highlight", "math", "search", "notes", "zoom"],
    },
  },

  // 在这里配置主题提供的插件
  plugins: {

    pwa: {
      cacheHTML : true,
      cacheImage : true,
      update :  "hint",
    },

    icon:{
      assets: [
        "fontawesome",          // Icon 配置文件
        "https://kit.fontawesome.com/b19836ac94.js",
      ],
    },

    notice: [
      {
        path: "/",
        title: "Anycast",
        showOnce: true,
        content: `你正在通过${anycastValue}节点访问本站`,
        actions: [
          {
            text: "前往了解",
            link: "https://anycast.ink/anycast/",
            type: "primary",
          },
          { text: '关闭窗口' },
        ],
      },
    ],
    
    //搜索
    meilisearch: {
      host: 'https://meilisearch.pysio.online',
      apiKey: 'd4248dbd5b1e428fd1355570086a990b937946d7261a6fddde34ec854a777a78',
      indexUid: 'pysioblog',
    },

    //博客
    blog: true,

    //RSS
    feed: {
      rss: true,
      channel: { ttl: 60, }
    },
    comment: {
      provider: "Waline",
      serverURL: "https://waline.pysio.online/.netlify/functions/comment",
      turnstileKey: "0x4AAAAAAA82nQE3KUhWBA2K",
      emoji: [
        'https://emoji.pysio.online/Chibi',
        '//cdn.jsdelivr.net/npm/@waline/emojis@1.2.0/qq',
        '//cdn.jsdelivr.net/npm/@waline/emojis@1.2.0/tw-emoji',
        '//cdn.jsdelivr.net/npm/@waline/emojis@1.2.0/bilibili',
        '//cdn.jsdelivr.net/npm/@waline/emojis@1.2.0/tw-flag'
      ],
    },

    components: {
      components: ["Badge", "VPCard"],
    },
   
  },
});
