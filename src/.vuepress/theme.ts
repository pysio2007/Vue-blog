import { hopeTheme } from "vuepress-theme-hope";
import gitDescribe from 'git-describe';
import navbar from "./navbar.js";
import sidebar from "./sidebar/index.js";
import pkg from 'nodejieba';
const { cut } = pkg;

//Git Hash
const gitInfo = gitDescribe.gitDescribeSync();
process.env.VUE_APP_GIT_HASH = gitInfo.hash;

export default hopeTheme({
  hostname: "https://www.pysio.online",

  author: {
    name: "Pysio",
    url: "https://github.com/pysio2007/",
  },

  iconAssets: [
    "fontawesome",
    "https://js.pysio.online/js/custom-icons.js",
    "https://js.pysio.online/js/brands.js",
    "https://js.pysio.online/js/light.min.js",
    "https://js.pysio.online/js/regular.min.js",
    "https://js.pysio.online/js/solid.min.js",
  ],

  logo: "https://imges.pysio.online//%E9%AB%98%E6%B8%85%E9%87%8D%E5%88%B6%E5%A4%B4%E5%83%8F.svg",

  repo: "pysio2007/Vue-blog",

  docsDir: "src",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: `Pysio's Home / 蜀ICP备2023021309号-1 /  <a href="https://github.com/pysio2007/Vue-blog/commit/${process.env.VUE_APP_GIT_HASH}" target="_blank" style="color: inherit; text-decoration: underline;">${process.env.VUE_APP_GIT_HASH}</a> `,
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
  // encrypt: {
  //   config: {
  //     "/demo/encrypt.html": ["1234"],
  //   },
  // },

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  hotReload: true,

  // 在这里配置主题提供的插件
  //搜索插件
  plugins: {
    //搜索插件
  searchPro: {
    indexContent: true,
    indexLocaleOptions: {
      "/": {
        // 使用 nodejs-jieba 进行分词
        tokenize: (text, fieldName) =>
          fieldName === "id" ? [text] : cut(text, true),
        },
      },
  },

    markdownHint : { // 启用 GFM 警告
      alert: true,
    },
    
    blog: true,

    //代码高亮
    prismjs: {
      themes: { light: 'one-light', dark: 'nord' },
      lineNumbers: false,
    },
    
    //RSS
    feed: {
      rss: true,
      channel: {ttl : 60,}
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

    // 此处开启了很多功能用于演示，你应仅保留用到的功能。
    markdownImage: {
      figure: true,
      lazyload: true,
      size: true,
      mark: true,
    },

    markdownMath: {
    //   // 启用前安装 katex
       type: "katex",
    //   // 或者安装 mathjax-full
    //   type: "mathjax",
    },

    // 此功能被开启用于演示，你应仅当使用时保留。
    markdownTab: true,

    // 此处开启了很多功能用于演示，你应仅保留用到的功能。
    mdEnhance: {
      align: true,
      attrs: true,
      component: true,
      demo: true,
      include: true,
      mark: true,
      plantuml: true,
      spoiler: true,
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
      chart: true,

      // insert component easily

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
    },

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   maxSize: 5120,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },

    // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
    // revealjs: {
    //   plugins: ["highlight", "math", "search", "notes", "zoom"],
    // },
  },
});
