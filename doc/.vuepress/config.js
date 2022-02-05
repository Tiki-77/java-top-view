const { config } = require("vuepress-theme-hope");

module.exports = config({
  title: "JavaTopView",
  description: "一个简单的Java学习笔记",

  dest: "./dist",

  head: [
    [
      "script",
      { src: "https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js" },
    ],
    [
      "script",
      {
        src: "https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js",
      },
    ],
    ["script", { src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js" }],
    [
      "script",
      { src: "https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js" },
    ],
  ],

  locales: {
    "/": {
      lang: "zh-CN"
    }
  },

  themeConfig: {
    logo: "/logo.svg",
    hostname: "https://tiki77.com",

    author: "TikiWong",

    nav: [
      { text: "首页", link: "/", icon: "home" },
      { text: "GitHub", link: "https://github.com/Tiki-77", icon: "github" },
      { text: "Gitee", link: "https://gitee.com/tikiwong", icon: "gitee" },
    ],

    sidebar: {
      "/": [
        {
          title: "Java", icon: "java", prefix: "java/",
          children: [{
            title: "基础", prefix: "base/",
            children: ["test"]
          }],
        },
      ],
    },

    blog: {
      sidebarDisplay: "mobile",
      avatar: "/avatar.jpg",
      links: {
        Github: "https://github.com/Tiki-77",
        Gitee: "https://gitee.com/tikiwong"
      },
    },

    pageInfo: ['time', 'category', 'tag', 'word', "reading-time"],

    footer: {
      display: true,
      content: "Java Top View",
    },

    // comment: {
    //   type: "waline",
    //   serverURL: "https://vuepress-theme-hope-comment.vercel.app",
    // },

    copyright: {
      status: "global",
    },

    git: {
      timezone: "Asia/Shanghai",
    },

    mdEnhance: {
      enableAll: true,
      presentation: {
        plugins: [
          "highlight",
          "math",
          "search",
          "notes",
          "zoom",
          "anything",
          "audio",
          "chalkboard",
        ],
      },
    },

    pwa: {
      favicon: "/logo.svg",
      cachePic: true,
      apple: {
        icon: "/assets/icon/apple-icon-152.png",
        statusBarColor: "black",
      },
      msTile: {
        image: "/assets/icon/ms-icon-144.png",
        color: "#ffffff",
      },
      manifest: {
        icons: [
          {
            src: "/assets/icon/chrome-mask-512.png",
            sizes: "512x512",
            purpose: "maskable",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-mask-192.png",
            sizes: "192x192",
            purpose: "maskable",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
        shortcuts: [
          {
            name: "Guide",
            short_name: "Guide",
            url: "/guide/",
            icons: [
              {
                src: "/assets/icon/guide-maskable.png",
                sizes: "192x192",
                purpose: "maskable",
                type: "image/png",
              },
              {
                src: "/assets/icon/guide-monochrome.png",
                sizes: "192x192",
                purpose: "monochrome",
                type: "image/png",
              },
            ],
          },
        ],
      },
    },
  },
});
