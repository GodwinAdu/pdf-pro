"use client";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { buttonVariants } from "../ui/button";
import UserAccountNav from "../UserAccountNav";
import { usePathname } from "next/navigation"; // To track active links

interface MenuItem {
    title: string;
    link?: string;
    subMenu?: MenuItem[];
    badge?: "coming soon" | "new"; // Badge type
    disabled?: boolean; // Disable link
}

const menuItems: MenuItem[] = [
    {
        title: "Home",
        link: "/",
    },
    {
        title: "AI Assistant",
        subMenu: [
            { title: "Chat with AI", link: "/chat-ai",  badge: "coming soon", disabled: true },
            { title: "Converse PDF", link: "/dashboard", badge: "new" },
            { title: "Text Bot", link: "/text_bot" },
            {
                title: "Study Tools",
                subMenu: [
                    { title: "Live Docs", link: "/live-documents"},
                    { title: "Note Book", link: "/live-documents", badge: "coming soon", disabled: true },
                    { title: "To-Do List", link: "/live-documents", badge: "coming soon", disabled: true },
                ],
            },
        ],
    },
    {
        title: "Collab",
        subMenu: [
            { title: "Problems Solving", link: "/problem_solving" ,badge: "coming soon", disabled: true },
            {
                title: "Contest Hub",
                subMenu: [
                    { title: "Practice Quiz", link: "/practice_quiz", badge: "coming soon", disabled: true },
                    { title: "Study Battles", link: "/study_battle", badge: "coming soon", disabled: true },
                    { title: "Daily Trial", link: "/daily_trail", badge: "coming soon", disabled: true },
                    { title: "Bi-Weekly Trial", link: "/problem_solving", badge: "coming soon", disabled: true },
                    { title: "Weekly Trial", link: "/problem_solving", badge: "coming soon", disabled: true },
                ],
            },
            {
                title: "Discuss Forums",
                subMenu: [
                    { title: "General Discussion", link: "/general_discussion" },
                    { title: "Group Discussion", link: "/group_discussion", badge: "coming soon", disabled: true },
                ],
            },
        ],
    },
    {
        title: "Get Help",
        subMenu: [
            { title: "Assignment Help", link: "/projects"},
            { title: "AI Research", link: "/join", badge: "coming soon", disabled: true },
            { title: "AI Care Study", link: "/problem_solving" ,badge: "coming soon", disabled: true },
        ],
    },
];

const Navbar = ({ user }: { user: any }) => {
    const [isOpen, setIsOpen] = useState(false); // Mobile menu state
    const [activeMenu, setActiveMenu] = useState<string | null>(null); // Track which main dropdown is open
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null); // Track which submenu is open
    const pathname = usePathname(); // Get the current URL path

    const toggleMenu = (menuTitle: string) => {
        setActiveMenu((prev) => (prev === menuTitle ? null : menuTitle));
    };

    const toggleSubMenu = (subMenuTitle: string) => {
        setActiveSubMenu((prev) => (prev === subMenuTitle ? null : subMenuTitle));
    };

    const isActiveLink = (link: string | undefined) => pathname === link; // Check if a link is active

    return (
        <nav className="sticky inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-teal-400">
                            EduxcelMaster
                        </Link>
                    </div>

                    {/* Mobile Hamburger Menu */}
                    {user && (
                        <div className="flex md:hidden gap-2 items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-black focus:outline-none"
                            >
                                <svg
                                    className="h-8 w-8"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                    />
                                </svg>
                            </button>
                            <div className="">
                                <UserAccountNav user={user} />
                            </div>
                        </div>
                    )}

                    {/* Main Desktop Menu */}
                    {user ? (
                        <>
                            <div className="hidden md:flex md:space-x-8 items-center">
                                {menuItems.map((item, index) => (
                                    <div key={index} className="relative">
                                        {item.link ? (
                                            <Link
                                                href={item.disabled ? "#" : item.link}
                                                className={cn(
                                                    "font-bold transition duration-300 ease-in-out flex items-center text-sm",
                                                    item.disabled ? "text-gray-400 cursor-not-allowed" : "hover:text-teal-400",
                                                    isActiveLink(item.link) ? "text-teal-400" : "text-black"
                                                )}
                                            >
                                                {item.title}
                                                {item.badge && (
                                                    <span className={`ml-1 px-1 py-0.5 rounded-full text-xs text-white ${item.badge === "new" ? "bg-green-500" : "bg-yellow-500"}`}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => toggleMenu(item.title)}
                                                className={`font-bold hover:text-teal-400 transition duration-300 ease-in-out flex items-center text-sm ${item.subMenu ? "cursor-pointer" : ""
                                                    }`}
                                            >
                                                {item.title}
                                                {item.subMenu && (
                                                    <>
                                                        {activeMenu === item.title ? (
                                                            <ChevronUpIcon className="h-5 w-5 ml-1" />
                                                        ) : (
                                                            <ChevronDownIcon className="h-5 w-5 ml-1" />
                                                        )}
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {/* Submenu for large screens */}
                                        {item.subMenu && activeMenu === item.title && (
                                            <div className="absolute right-0 mt-4 w-72 bg-white text-black rounded-lg shadow-2xl z-20">
                                                <ul className="py-2 px-4 space-y-4">
                                                    {item.subMenu.map((subItem, subIndex) => (
                                                        <li key={subIndex}>
                                                            {subItem.link ? (
                                                                <Link
                                                                    href={subItem.disabled ? "#" : subItem.link}
                                                                    className={cn(
                                                                        "block font-bold text-sm w-full text-left flex items-center justify-between",
                                                                        subItem.disabled ? "text-gray-400 cursor-not-allowed" : "hover:text-teal-400",
                                                                        isActiveLink(subItem.link) ? "text-teal-400" : "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {subItem.title}
                                                                    {subItem.badge && (
                                                                        <span className={`ml-1 px-1 py-0.5 rounded-full text-[10px] text-white ${subItem.badge === "new" ? "bg-green-500" : "bg-yellow-500"}`}>
                                                                            {subItem.badge}
                                                                        </span>
                                                                    )}
                                                                </Link>
                                                            ) : (
                                                                <button
                                                                    className="block font-bold text-sm transition duration-300 ease-in-out w-full text-left flex items-center justify-between"
                                                                    onClick={() => toggleSubMenu(subItem.title)}
                                                                >
                                                                    {subItem.title}
                                                                    {subItem.subMenu && (
                                                                        <>
                                                                            {activeSubMenu === subItem.title ? (
                                                                                <ChevronUpIcon className="h-5 w-5" />
                                                                            ) : (
                                                                                <ChevronDownIcon className="h-5 w-5" />
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </button>
                                                            )}

                                                            {subItem.subMenu && activeSubMenu === subItem.title && (
                                                                <ul className="ml-4 mt-2 bg-transparent p-2 rounded-lg text-sm space-y-4">
                                                                    {subItem.subMenu.map((nestedItem, nestedIndex) => (
                                                                        <li key={nestedIndex}>
                                                                            <Link
                                                                                href={nestedItem?.disabled ? "#" : nestedItem?.link || "#"}
                                                                                className={cn(
                                                                                    "block font-bold text-sm w-full text-left flex items-center justify-between",
                                                                                    nestedItem.disabled ? "text-gray-400 cursor-not-allowed" : "hover:text-teal-400",
                                                                                    isActiveLink(nestedItem.link) ? "text-teal-400" : "text-muted-foreground"
                                                                                )}
                                                                            >
                                                                                {nestedItem.title}
                                                                                {nestedItem.badge && (
                                                                                    <span className={`ml-1 px-1 py-0.5 rounded-full text-[10px] text-white ${subItem.badge === "new" ? "bg-green-500" : "bg-yellow-500"}`}>
                                                                                        {nestedItem.badge}
                                                                                    </span>
                                                                                )}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div>
                                    <UserAccountNav user={user} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
                                Login
                            </Link>
                            <Link href="/login" className={cn(buttonVariants({ size: "sm" }), "hidden md:flex")}>
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Dropdown Menu */}
                {isOpen && (
                    <div className="md:hidden space-y-4 mt-2 bg-white text-black p-4 rounded-lg shadow-lg">
                        {menuItems.map((item, index) => (
                            <div key={index} className="relative">
                                {item.link ? (
                                    <Link
                                        href={item.disabled ? "#" : item.link}
                                        className={cn(
                                            "block font-bold text-sm transition duration-300 ease-in-out flex items-center justify-between",
                                            item.disabled ? "text-gray-400 cursor-not-allowed" : "hover:text-teal-400"
                                        )}
                                    >
                                        {item.title}
                                        {item.badge && (
                                            <span className={`ml-1 px-1 py-0.5 rounded-full text-xs text-white ${item.badge === "new" ? "bg-green-500" : "bg-yellow-500"}`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => toggleMenu(item.title)}
                                        className="block font-bold text-sm transition duration-300 ease-in-out w-full text-left flex items-center justify-between"
                                    >
                                        {item.title}
                                        {item.subMenu && (
                                            <>
                                                {activeMenu === item.title ? (
                                                    <ChevronUpIcon className="h-5 w-5" />
                                                ) : (
                                                    <ChevronDownIcon className="h-5 w-5" />
                                                )}
                                            </>
                                        )}
                                    </button>
                                )}

                                {item.subMenu && activeMenu === item.title && (
                                    <ul className="ml-4 mt-2 space-y-4 text-sm">
                                        {item.subMenu.map((subItem, subIndex) => (
                                            <li key={subIndex}>
                                                {subItem.link ? (
                                                    <Link
                                                        href={subItem.disabled ? "#" : subItem.link}
                                                        className={cn(
                                                            "block font-bold text-muted-foreground hover:text-teal-400 transition duration-300 ease-in-out",
                                                            subItem.disabled ? "text-gray-400 cursor-not-allowed" : ""
                                                        )}
                                                    >
                                                        {subItem.title}
                                                        {subItem.badge && (
                                                            <span className={`ml-1 px-1 py-0.5 rounded-full text-xs text-white ${subItem.badge === "new" ? "bg-green-500" : "bg-yellow-500"}`}>
                                                                {subItem.badge}
                                                            </span>
                                                        )}
                                                    </Link>
                                                ) : (
                                                    <button
                                                        className="block font-bold transition duration-300 ease-in-out w-full text-left flex items-center justify-between"
                                                        onClick={() => toggleSubMenu(subItem.title)}
                                                    >
                                                        {subItem.title}
                                                        {subItem.subMenu && (
                                                            <>
                                                                {activeSubMenu === subItem.title ? (
                                                                    <ChevronUpIcon className="h-5 w-5" />
                                                                ) : (
                                                                    <ChevronDownIcon className="h-5 w-5" />
                                                                )}
                                                            </>
                                                        )}
                                                    </button>
                                                )}

                                                {subItem.subMenu && activeSubMenu === subItem.title && (
                                                    <ul className="ml-4 mt-4 space-y-2 text-sm">
                                                        {subItem.subMenu.map((nestedItem, nestedIndex) => (
                                                            <li key={nestedIndex}>
                                                                <Link
                                                                    href={nestedItem.link || "#"}
                                                                    className="block font-bold text-muted-foreground hover:text-teal-400 transition duration-300 ease-in-out"
                                                                >
                                                                    {nestedItem.title}
                                                                    {nestedItem.badge && (
                                                                        <span className={`ml-1 px-1 py-0.5 rounded-full text-xs text-white ${nestedItem.badge === "new" ? "bg-green-500" : "bg-yellow-500"}`}>
                                                                            {nestedItem.badge}
                                                                        </span>
                                                                    )}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
