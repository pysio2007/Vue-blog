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
        ],
      },      
    ],
  },
  {
    text: "杂项",
    icon: "fa-solid fa-ellipsis fa-xl",
    link: "/other/",
    children: [
      { text: "友链", icon: "fa-solid fa-link", link: "/other/friends" },
    ],
  },
  {
    text: "关于",
    icon: "fa-regular fa-circle-info",
    link: "/intro.html",
  },
]);
