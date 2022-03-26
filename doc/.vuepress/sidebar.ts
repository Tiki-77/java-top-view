import {defineSidebarConfig} from "vuepress-theme-hope";

export default defineSidebarConfig({
    "/": [
        {
            text: "Java", icon: "java", prefix: "java/",
            children: [{
                text: "并发编程", prefix: "concurrent/",
                children: [{
                    text: "JUC", prefix: "juc/",
                    children: ["lock"]
                }]
            }],
        },
        {
            text: "数据库", icon: "database", prefix: "db/",
            children: [{
                text: "Reds", icon: "redis", prefix: "redis/",
                children: ["slaveof"]
            }],
        }
    ],
})