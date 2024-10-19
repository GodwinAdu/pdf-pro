const menuData = [
    {
        id: 1,
        title: "Home",
        path: "/",
        newTab: false,
    },
    {
        id: 4,
        title: "AI Assistant",
        newTab: false,
        submenu: [
            {
                id: 42,
                title: "Chat with AI",
                path: "/chat-ai",
                newTab: false,
            },
            {
                id: 41,
                title: "Converse PDF",
                path: "/dashboard",
                newTab: false,
            },
            {
                id: 43,
                title: "Text Bot",
                path: "/text_bot",
                newTab: false,
            },
            {
                id: 44,
                title: "Webinars",
                path: "/webinars",
                newTab: false,
            }
        ],
    },
    {
        id: 2,
        title: "Group Study",
        newTab: false,
        submenu: [
            {
                id: 21,
                title: "Live Docs",
                path: "/live-documents",
                newTab: false,
            },
            
        ],
    },
    {
        id: 5,
        title: "Productive Tools",
        newTab: false,
        submenu: [
            {
                id: 51,
                title: "Chat with AI",
                path: "/chat-ai",
                newTab: false,
            },
            {
                id: 52,
                title: "Text Bot",
                path: "/text_bot",
                newTab: false,
            },
            {
                id: 53,
                title: "Research Work Assistant",
                path: "/interviews",
                newTab: false,
            },
            {
                id: 54,
                title: "From Nurses",
                path: "/from-nurses",
                newTab: false,
            }
        ],
    },
    {
        id: 6,
        title: "Assignment Help",
        path: "/projects",
        newTab: false,
    },
];
export default menuData;
