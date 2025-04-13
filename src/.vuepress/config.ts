import { defineUserConfig } from "vuepress";
import { viteBundler } from '@vuepress/bundler-vite'
import { googleAnalyticsPlugin } from "@vuepress/plugin-google-analytics";
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
    
    googleAnalyticsPlugin({   //Google Analytics
      id: 'G-G9Q1H2C9MN',
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
    ["script", { 
      defer: true, 
      src: "https://umami.pysio.online/script.js",
      "data-website-id": "aeefefc0-5d7b-46a8-96d2-24bc3bb31fbf"
    }],
    ["script", { async: true, src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6547593871065949", crossorigin: "anonymous" }],  //Google Ads
  ],
  
  theme,
});
