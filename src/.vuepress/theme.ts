import { hopeTheme } from "vuepress-theme-hope";
import gitDescribe from 'git-describe';
import navbar from "./navbar.js";
import sidebar from "./sidebar/index.js";

//分词
import pkg from 'nodejieba';
const { cut } = pkg;

//Git Hash
const gitInfo = gitDescribe.gitDescribeSync();
const gitHash = gitInfo.hash.startsWith('g') ? gitInfo.hash.slice(1) : gitInfo.hash;
process.env.VUE_APP_GIT_HASH = gitHash;

export default hopeTheme({
  hostname: "https://www.pysio.online",

  darkmode: "switch",

  author: {
    name: "Pysio",
    url: "https://github.com/pysio2007/",
  },

  iconAssets: [
    "fontawesome",
    "https://kit.fontawesome.com/b19836ac94.js",
    // "https://files.pysio.online/files/Pysio-FontAwesome/js/custom-icons.js",
    // "https://files.pysio.online/files/Pysio-FontAwesome/js/brands.js",
    // "https://files.pysio.online/files/Pysio-FontAwesome/js/light.min.js",
    // "https://files.pysio.online/files/Pysio-FontAwesome/js/regular.min.js",
    "https://files.pysio.online/files/Pysio-FontAwesome/js/solid.min.js",
  ],

  logo: "https://www.pysio.online/assets/imgs/avast.svg",

  repo: "pysio2007/Vue-blog",

  docsDir: "src",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: `Pysio's Home / <a href="https://beian.miit.gov.cn/" target="_blank" style="color: inherit; text-decoration: none; font-weight: normal;">蜀ICP备2023021309号-1</a> / <a href="https://beian.mps.gov.cn/#/query/webSearch" target="_blank" style="color: inherit; text-decoration: none; font-weight: normal;">川公网安备51010802032524号</a> / <a href="https://github.com/pysio2007/Vue-blog/commit/${process.env.VUE_APP_GIT_HASH}" target="_blank" style="color: inherit; text-decoration: none; font-weight: normal;">${process.env.VUE_APP_GIT_HASH}</a> `,
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


    // install sandpack-vue3 before enabling it
    // sandpack: true,

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

    //搜索
    slimsearch: {
      indexContent: true,
      indexLocaleOptions: {
        "/": {
          // 使用 nodejs-jieba 进行分词
          tokenize: (text, fieldName) =>
            fieldName === "id" ? [text] : cut(text, true),
        },
      },
    },

    blog: true,

    //RSS
    feed: {
      rss: true,
      channel: { ttl: 60, }
    },
    // 启用之前需安装 @waline/client
    // 警告: 这是一个仅供演示的测试服务，在生产环境中请自行部署并使用自己的服务！
    comment: {
      provider: "Giscus",
      comment: true,
      repo: 'pysio2007/Vue-blog',
      repoId: 'R_kgDOM6WQXQ',
      category: 'Polls',
      categoryId: 'DIC_kwDOM6WQXc4CjFVc',
      mapping: "title"
    },

    components: {
      components: ["Badge", "VPCard"],
    },

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    pwa: {
      favicon: "/favicon.ico",
      cacheHTML: true,
      cacheImage: true,
      appendBase: true,
      maxSize: 5120,
      apple: {
        icon: "/assets/icon/apple-icon-152.png",
        statusBarColor: "black",
      },
      // msTile: {
      //   image: "/assets/icon/ms-icon-144.png",
      //   color: "#ffffff",
      // },
      manifest: {
        icons: [
          {
            src: "/assets/icon/chrome-mask-512.png",
            sizes: "512x512",
            purpose: "maskable",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-mask-192.png",
            sizes: "192x192",
            purpose: "maskable",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
        shortcuts: [
          {
            name: "Demo",
            short_name: "Demo",
            url: "/demo/",
            icons: [
              {
                src: "/assets/icon/guide-maskable.png",
                sizes: "192x192",
                purpose: "maskable",
                type: "image/png",
              },
            ],
          },
        ],
      },
    },
  },
});
