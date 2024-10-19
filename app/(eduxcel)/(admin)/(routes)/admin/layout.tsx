
import { NavItem } from "@/components/admin/NavItem"
import { LayoutDashboard, LogOut, Menu, SettingsIcon, User, UsersIcon } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"


export default function RootLayout({
    children
}: {
    children: ReactNode
}) {
    return (
        <div className="min-h-screen">
            <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-[60px] items-center border-b px-5">
                            <Link
                                className="flex items-center gap-2 font-semibold"
                                href="/"
                            >
                               <span>Admin</span>
                            </Link>
                        </div>
                        <div className="flex-1 overflow-auto py-2">
                            <nav className="grid items-start px-4 text-sm font-medium">
                                <NavItem href="/admin">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </NavItem>
                                <NavItem href="/admin/users">
                                    <UsersIcon className="h-4 w-4" />
                                    Users
                                </NavItem>
                                <NavItem href="/admin/projects">
                                    <UsersIcon className="h-4 w-4" />
                                    Projects
                                </NavItem>
                                <NavItem href="/admin/feedback">
                                    <SettingsIcon className="h-4 w-4" />
                                    Feedbacks
                                </NavItem>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 justify-between lg:justify-end">
                        <Link
                            className="flex items-center gap-2 font-semibold lg:hidden"
                            href="/"
                        >
                            {/* <Logo /> */}
                            <span className="">Admin</span>
                        </Link>
                        <Menu className="block md:hidden" />
                    </header>
                    {children}
                </div>
            </div>
            {/* <Analytics /> */}
        </div>
    )
}