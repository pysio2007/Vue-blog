import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "博文",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "博文",
        icon: "note",
        prefix: "/category/",
        children: [
          { text: "日常", icon: "book", link: "daily/" },
          { text: "开发", icon: "code", link: "develop/" },
        ],
      },
    ],
  },
]);
