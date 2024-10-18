import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { cachePlugin } from '@vuepress/plugin-cache'

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "Pysio's Home",
  description: "一个温暖的家",
  plugins: [
    cachePlugin({       // 开启缓存
      type: 'filesystem',
    }),
  ],
  head: [
      //JetBrains Mono
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    ],
    [
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap",
        rel: "stylesheet",
      },
    ],
  ],
  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
