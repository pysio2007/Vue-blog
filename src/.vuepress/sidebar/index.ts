import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "日常",
      icon: "book",
      prefix: "posts/daily",
      children: "structure",
    },
    {
      text: "开发",
      icon: "code",
      prefix: "posts/develop",
      children: "structure",
    },
  ],
});
