import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "博文",
    icon: "fa-solid fa-pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "博文",
        icon: "note",
        prefix: "/category/",
        link: "/posts/",
        children: [
          { text: "日常", icon: "fa-regular fa-book", link: "daily/" },
          { text: "开发", icon: "fa-regular fa-code", link: "develop/" },
          { text: "小曦", icon: "fa-solid fa-heart", link: "nekoxii/" },
        ],
      },      
    ],
  },
  {
    text: "工具",
    icon: "fa-solid fa-tools",
    link: "/posts/tools/",
    children:[
      { text: "IP 检测", icon: "fa-solid fa-tools", link: "/posts/tools/ipcheck" },
    ],
  },
  {
    text: "杂项",
    icon: "fa-solid fa-ellipsis fa-xl",
    link: "/other/",
    children: [
      { text: "友链", icon: "fa-solid fa-link", link: "/other/friends" },
      { text: "问题追踪", icon: "fa-kit fa-issues", link: "/other/issues" },
      { text: "Wordle", icon: "fa-regular fa-gamepad-modern", link: "/other/wordle" },
      { text: "许可证", icon: "fa-brands fa-creative-commons", link: "/other/cc.html" },
    ],
  },
  {
    text: "关于",
    icon: "fa-regular fa-circle-info",
    link: "/intro.html",
  },
]);
