import { defineHopeConfig } from "vuepress-theme-hope";
import themeConfig from "./theme";

export default defineHopeConfig({
  title: "Java Top View",
  description: "一份Java学习笔记",

  dest: "./dist",

  head: [
    [
      "link",
      {
        rel: "stylesheet",
        href: "//at.alicdn.com/t/font_3280229_top2fyelo8h.css",
      },
    ],
  ],

  locales: {
    "/": {
      lang: "zh-CN"
    }
  },

  themeConfig,
});
