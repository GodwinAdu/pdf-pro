import FeedbackModal from "@/components/feedback/FeedbackModal"
import ShowFooter from "@/components/footer/ShowFooter"
import Navbar from "@/components/header/Navbar"
import IntroModal from "@/components/modal/IntroModal"
import { ReactNode } from "react"


export default function RootLayout({
    children
}: {
    children: ReactNode
}) {
    return (
        <div className="min-h-screen">
            <Navbar />
            {children}
            <IntroModal />
            <FeedbackModal />
            <ShowFooter />
        </div>
    )
}