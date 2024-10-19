"use client"

import { Home, LineChart, Package, Package2, Settings, ShoppingCart, Users2, DollarSign, FileText, BarChart, Laptop, Hand, HandCoins, PlusCircle, Banknote, PiggyBank, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePathname } from 'next/navigation';

const Sidebar = ({user}) => {
    const pathname = usePathname()

    const sidebarLinks = [
        { title: "Dashboard", path: `/user/${user?._id}`, icon: <Home />, roleField: "dashboard" },
        { title: "Profile", path: `/user/${user?._id}/profile`, icon: <User />, roleField: "profile" },
        { title: "Coins", path: `/user/${user?._id}/coins`, icon: <PiggyBank />, roleField: "coins" },
        { title: "Course", path: `/user/${user?._id}/courses`, icon: <PlusCircle />, roleField: "create courses" },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Link
                    href="/#"
                    className="group mb-4 flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                    <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                    <span className="sr-only">Acme Inc</span>
                </Link>
                <TooltipProvider>
                    {sidebarLinks.map((link, index) => (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={link.path}
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${pathname === link.path ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {link.icon}
                                    <span className="sr-only">{link.title}</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">{link.title}</TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/settings"
                                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${pathname === '/settings' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
        </aside>
    );
};

export default Sidebar;
