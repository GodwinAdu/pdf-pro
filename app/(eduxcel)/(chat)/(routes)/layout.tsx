import Navbar from "@/components/header/Navbar"
import Sidebar from "@/components/sidebar/Sidebar"
import { ReactNode } from "react"


export default function RootLayout({
    children
}: {
    children: ReactNode
}) {
    return (
        <div>
            <Navbar />
            <div className="relative overflow-hidden">
                <div className="hidden h-[calc(100vh-3.5rem)] md:flex  md:fixed md:w-72  z-[80] bg-gray-900">
                    <div className="w-full">
                        <Sidebar />
                    </div>
                </div>
                <main className="md:pl-72 inset-y-0 h-[calc(100vh-3.5rem)]">
                    {children}
                </main>
            </div>
        </div>
    )
}