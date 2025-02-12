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
          { text: "资源分享", icon: "fa-regular fa-folder-open", link: "resource/" },
        ],
      },      
    ],
  },
  {
    text: "工具",
    icon: "fa-solid fa-tools",
    link: "/tools/",
    children:[
      { text: "IP 检测", icon: "fa-solid fa-globe", link: "/tools/ipcheck" },
      { text: "Pastebin (前期版本)", icon: "fa-solid fa-paste", link: "/tools/Pastebin" },
      { text: "McMod搜索(测试)", icon: "fa-kit fa-modrinth", link: "/tools/mcmod" },
    ],
  },
  {
    text: "杂项",
    icon: "fa-solid fa-ellipsis fa-xl",
    link: "/other/",
    children: [
      { text: "友链", icon: "fa-solid fa-link", link: "/other/friends" },
      { text: "服务状态", icon: "fa-regular fa-signal-bars", link: "/other/status" },
      { text: "问题追踪", icon: "fa-kit fa-issues", link: "/other/issues" },
      { text: "许可证", icon: "fa-brands fa-creative-commons", link: "/other/cc.html" },
    ],
  },
  {
    text: "小游戏",
    icon: "fa-regular fa-gamepad-modern",
    link: "/Game/",
    children: [
      { text: "Wordle", icon: "fa-regular fa-gamepad-modern", link: "/Game/wordle" },
      { text: "康威生命游戏", icon: "fa-regular fa-block", link: "/Game/GameofLife" },
      { text: "兰顿蚂蚁", icon: "fa-solid fa-ant", link: "/Game/Langtonsant" },  
      { text: "2048", icon: "fa-regular fa-block", link: "/Game/2048" },
    ],
  },
  {
    text: "DN42",
    icon: "fa-solid fa-signal-stream",
    link: "https://asn.pysio.online/dn42/",
  },
  {
    text: "关于",
    icon: "fa-regular fa-circle-info",
    link: "/intro.html",
  },
  {
    text: "开往",
    icon: "fa-solid fa-train-subway",
    link: "https://www.travellings.cn/go.html",
  },
]);
