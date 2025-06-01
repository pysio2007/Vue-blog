import { navbar } from "vuepress-theme-hope";

// 中文导航栏配置
export const zhNavbar = navbar([
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
      { text: "赞助", icon: "fa-solid fa-heart", link: "/sponsors" },
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
    link: "https://ixpm.akae.re/en/dn42/",
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

// 英文导航栏配置
export const enNavbar = navbar([
  "/en/",
  {
    text: "Posts",
    icon: "fa-solid fa-pen-to-square",
    prefix: "/en/posts/",
    children: [
      {
        text: "Posts",
        icon: "note",
        prefix: "/en/category/",
        link: "/en/posts/",
        children: [
          { text: "Daily", icon: "fa-regular fa-book", link: "daily/" },
          { text: "Development", icon: "fa-regular fa-code", link: "develop/" },
        ],
      },      
    ],
  },
  {
    text: "Tools",
    icon: "fa-solid fa-tools",
    link: "/en/tools/",
    children:[
      { text: "IP Check", icon: "fa-solid fa-globe", link: "/en/tools/ipcheck" },
      { text: "Pastebin (Beta)", icon: "fa-solid fa-paste", link: "/en/tools/Pastebin" },
      { text: "McMod Search (Beta)", icon: "fa-kit fa-modrinth", link: "/en/tools/mcmod" },
    ],
  },
  {
    text: "Misc",
    icon: "fa-solid fa-ellipsis fa-xl",
    link: "/en/other/",
    children: [
      { text: "Sponsors", icon: "fa-solid fa-heart", link: "/en/sponsors" },
      { text: "Friends", icon: "fa-solid fa-link", link: "/en/other/friends" },
      { text: "Service Status", icon: "fa-regular fa-signal-bars", link: "/en/other/status" },
      { text: "Issue Tracker", icon: "fa-kit fa-issues", link: "/en/other/issues" },
      { text: "License", icon: "fa-brands fa-creative-commons", link: "/en/other/cc.html" },
    ],
  },
  {
    text: "Games",
    icon: "fa-regular fa-gamepad-modern",
    link: "/en/Game/",
    children: [
      { text: "Wordle", icon: "fa-regular fa-gamepad-modern", link: "/en/Game/wordle" },
      { text: "Conway's Game of Life", icon: "fa-regular fa-block", link: "/en/Game/GameofLife" },
      { text: "Langton's Ant", icon: "fa-solid fa-ant", link: "/en/Game/Langtonsant" },  
      { text: "2048", icon: "fa-regular fa-block", link: "/en/Game/2048" },
    ],
  },
  {
    text: "DN42",
    icon: "fa-solid fa-signal-stream",
    link: "https://ixpm.akae.re/en/dn42/",
  },
  {
    text: "About",
    icon: "fa-regular fa-circle-info",
    link: "/en/intro.html",
  },
  {
    text: "Travellings",
    icon: "fa-solid fa-train-subway",
    link: "https://www.travellings.cn/go.html",
  },
]);

// 默认导出中文导航栏（保持向后兼容）
export default zhNavbar;
