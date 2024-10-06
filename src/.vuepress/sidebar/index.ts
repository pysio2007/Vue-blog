import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/posts/": [
    {
      text: "Pysio's Home",
      prefix: "/",
      link: "/posts/",
    },
    {
      text: "日常",
      icon: "book",
      prefix: "daily",
      children: "structure",
      collapsible: true,
    },
    {
      text: "开发",
      icon: "code",
      prefix: "develop",
      children: "structure",
      collapsible: true,
    },
  ],
  "/other/": [
    {
      text: "杂项",
      link: "/other/",
    },
    {
      text: "",
      children: "structure",
    },
  ],
});
