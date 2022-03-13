import {defineThemeConfig} from "vuepress-theme-hope";
import sidebar from "./sidebar";

export default defineThemeConfig({
    logo: "/logo.svg",
    hostname: "https://tiki77.com",

    author: "TikiWong",

    // navbar: [
    //     {text: "首页", link: "/", icon: "home"},
    //     {text: "GitHub", link: "https://github.com/Tiki-77/java-top-view", icon: "github"},
    //     {text: "Gitee", link: "https://gitee.com/tikiwong/java-top-view", icon: "gitee"},
    // ],

    sidebar,

    blog: {
        sidebarDisplay: "mobile",
        avatar: "/avatar.jpg",
        roundAvatar: true,
        medias: {
            Github: "https://github.com/Tiki-77",
            Gitee: "https://gitee.com/tikiwong"
        },
    },

    pageInfo: ['Date', 'Category', 'Tag', 'Word', "ReadingTime"],

    displayFooter: true,
    footer: "<a href='https://beian.miit.gov.cn/'>冀ICP备19035221号-1</a>",
    copyright: "Copyright © 2022 TikiWong",

    pure: true,

    iconPrefix: "iconfont icon-",

    git: {
        timezone: "Asia/Shanghai",
    },
    // 默认为 GitHub. 同时也可以是一个完整的 URL
    repo: "Tiki-77/java-top-view",
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub" / "GitLab" / "Gitee" / "Bitbucket" 其中之一，或是 "Source"。
    repoLabel: "GitHub",
    // 是否在导航栏内显示仓库链接，默认为 `true`
    repoDisplay: true,

    plugins: {
        blog: {
            autoExcerpt: true,
        },
        mdEnhance: {
            enableAll: true,
            presentation: {
                plugins: [
                    "highlight",
                    "math",
                    "search",
                    "notes",
                    "zoom"
                ],
            },
        },
        search: {
            maxSuggestions: 10,
            hotKeys: ["s", "Enter"],
            isSearchable: (page) => page.path !== "/",
            getExtraFields: () => [],
            locales: {
                "/": {
                    placeholder: "搜索",
                },
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
})
