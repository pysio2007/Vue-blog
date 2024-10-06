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
        children: [
          { text: "日常", icon: "fa-regular fa-book", link: "daily/" },
          { text: "开发", icon: "fa-regular fa-code", link: "develop/" },
        ],
      },      
    ],
  },
  {
    text: "关于",
    icon: "fa-regular fa-circle-info",
    link: "/intro.html",
  },
]);
