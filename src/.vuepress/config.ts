import { defineUserConfig } from "vuepress";
import { umamiAnalyticsPlugin } from '@vuepress/plugin-umami-analytics'
import { viteBundler } from '@vuepress/bundler-vite'
import { removeHtmlExtensionPlugin } from 'vuepress-plugin-remove-html-extension'
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

    umamiAnalyticsPlugin({   //网站追踪
      id: 'e86a18d7-a5f6-4f55-85af-e99be291ed9b',
      link: 'https://umami.pysio.online/script.js',
      cache: true,
    }),
    
    // 更干净的URL
    // removeHtmlExtensionPlugin()

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
    // ["script", { async: true, src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6547593871065949", crossorigin: "anonymous" }],  //Google Ads
  ],

  bundler: viteBundler({
    viteOptions: {
      build: {
        minify: 'terser', 
        cssMinify: true, // 开启CSS压缩
        assetsInlineLimit: 4096, // 小于4kb的资源内联为base64
        terserOptions: {
          compress: {
            drop_console: true,    // 移除console
            drop_debugger: true,   // 移除debugger
            pure_funcs: ['console.log'], // 移除指定函数
            collapse_vars: true,   // 内联变量
            reduce_vars: true,     // 优化变量
            dead_code: true,       // 移除死代码
            toplevel: true,        // 顶级作用域变量压缩
            passes: 2              // 压缩次数
          },
          mangle: {
            toplevel: true,      // 混淆顶级作用域名称
            safari10: true       // 兼容safari10
          },
          format: {
            comments: true,     // 移除注释
            ascii_only: true,    // 转义Unicode字符
            beautify: false      // 不美化输出
          }
        },
        rollupOptions: {
          output: {
            compact: true      // 压缩输出
          }
        },
        chunkSizeWarningLimit: 2000 // 分块大小警告限制
      }
    }
  }),

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
