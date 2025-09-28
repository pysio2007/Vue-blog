import { defineUserConfig } from "vuepress";
import { viteBundler } from '@vuepress/bundler-vite'
import { googleAnalyticsPlugin } from "@vuepress/plugin-google-analytics";
import theme from "./theme.js";
import { cachePlugin } from '@vuepress/plugin-cache'
import { telegramInstantViewPlugin } from "./plugins/telegram-instant-view.js";
import { ogImagePlugin } from "./plugins/og-image-plugin.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "Pysio's Home",
      description: "一个温暖的家",
    },
    "/en/": {
      lang: "en-US",
      title: "Pysio's Home",
      description: "A Warm Home",
    },
  },

  plugins: [
    cachePlugin({       // 开启缓存
      type: 'filesystem',
    }),
    
    googleAnalyticsPlugin({   //Google Analytics
      id: 'G-G9Q1H2C9MN',
    }),
    
    telegramInstantViewPlugin(),  // Telegram Instant View 支持
    
    ogImagePlugin(),  // OG Image 生成器
    
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
    
    // Telegram Instant View optimization meta tags
    ["meta", { name: "telegram:instant_view", content: "supported" }],
    ["meta", { property: "article:author", content: "Pysio" }],
    ["meta", { property: "article:published_time", content: "" }], // Will be set per page
    ["meta", { name: "author", content: "Pysio" }],
    
    // Enhanced Open Graph for better Telegram sharing
    ["meta", { property: "og:site_name", content: "Pysio's Home" }],
    ["meta", { property: "og:type", content: "article" }],
    ["meta", { property: "og:locale", content: "zh_CN" }],
    ["meta", { property: "og:locale:alternate", content: "en_US" }],
    
    // Twitter Card for better social sharing
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@pysio2007" }],
    ["meta", { name: "twitter:creator", content: "@pysio2007" }],
    
    // Apple NFC Web Card support
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "default" }],
    ["meta", { name: "apple-mobile-web-app-title", content: "Pysio's Home" }],
    ["meta", { name: "format-detection", content: "telephone=no" }],
    ["link", { rel: "apple-touch-icon", href: "/assets/icon/apple-icon-152.png", sizes: "152x152" }],
    ["link", { rel: "mask-icon", href: "/logo.svg", color: "#3eaf7c" }],
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "msapplication-TileColor", content: "#3eaf7c" }],
    ["meta", { name: "msapplication-TileImage", content: "/assets/icon/ms-icon-144.png" }],
    
    ["script", { 
      defer: true, 
      src: "https://umami.pysio.online/script.js",
      "data-website-id": "e7714c23-dd48-4e43-8faf-dc2ea6fb9e34"
    }],
    ["script", { async: true, src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6547593871065949", crossorigin: "anonymous" }],  //Google Ads
  ],
  
  theme,
});
