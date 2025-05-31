import { sidebar } from "vuepress-theme-hope";

// 中文侧边栏配置
export const zhSidebar = sidebar({
  "/":[
    {
      text: "Pysio's Home",
      link: "/",
    },
    {
      text: "分类",
      link: "/category/",
      icon: "fa-regular fa-table-cells fa-lg",
    },
    {
      text: "标签",
      link: "/tag/",
      icon: "fa-solid fa-tags",
    },
    {
      text: "归档",
      link: "/article/",
      icon: "fa-solid fa-box-archive",
    },
    {
      text: "星标文章",
      link: "/star/",
      icon: "fa-solid fa-star",
    },
    {
      text: "时间线",
      link: "/timeline/",
      icon: "fa-regular fa-timeline",
    },
    {
      text: "关于",
      link: "/intro.html",
      icon: "fa-regular fa-circle-info",
    },
  ],
  "/posts/": [
    {
      text: "Pysio's Home",
      prefix: "/",
      link: "/posts/",
    },
    {
      text: "日常",
      prefix: "daily",
      children: "structure",
      collapsible: true,
    },
    {
      text: "开发",
      prefix: "develop",
      children: "structure",
      collapsible: true,
    }
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
  "/tools/": [
    {
      text: "工具",
      link: "/tools/",
    },
    {
      text: "",
      children: "structure",
    },
  ],
  "/Game/": [
    {
      text: "小游戏",
      link: "/Game/",
    },
    {
      text: "",
      children: "structure",
    }
  ],
});

// 英文侧边栏配置
export const enSidebar = sidebar({
  "/en/":[
    {
      text: "Pysio's Home",
      link: "/en/",
    },
    {
      text: "Categories",
      link: "/en/category/",
      icon: "fa-regular fa-table-cells fa-lg",
    },
    {
      text: "Tags",
      link: "/en/tag/",
      icon: "fa-solid fa-tags",
    },
    {
      text: "Archive",
      link: "/en/article/",
      icon: "fa-solid fa-box-archive",
    },
    {
      text: "Starred",
      link: "/en/star/",
      icon: "fa-solid fa-star",
    },
    {
      text: "Timeline",
      link: "/en/timeline/",
      icon: "fa-regular fa-timeline",
    },
    {
      text: "About",
      link: "/en/intro.html",
      icon: "fa-regular fa-circle-info",
    },
  ],
  "/en/posts/": [
    {
      text: "Pysio's Home",
      prefix: "/en/",
      link: "/en/posts/",
    },
    {
      text: "Daily",
      prefix: "daily",
      children: "structure",
      collapsible: true,
    },
    {
      text: "Development",
      prefix: "develop",
      children: "structure",
      collapsible: true,
    }
  ],
  "/en/other/": [
    {
      text: "Misc",
      link: "/en/other/",
    },
    {
      text: "",
      children: "structure",
    },
  ],
  "/en/tools/": [
    {
      text: "Tools",
      link: "/en/tools/",
    },
    {
      text: "",
      children: "structure",
    },
  ],
  "/en/Game/": [
    {
      text: "Games",
      link: "/en/Game/",
    },
    {
      text: "",
      children: "structure",
    }
  ],
});

// 默认导出中文侧边栏（保持向后兼容）
export default zhSidebar;
