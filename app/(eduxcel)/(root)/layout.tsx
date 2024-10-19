import FeedbackModal from "@/components/feedback/FeedbackModal"
import ShowFooter from "@/components/footer/ShowFooter"
import IntroModal from "@/components/modal/IntroModal"
import { ReactNode } from "react"
import MainNavbar from "@/components/header3/MainNavbar"


export default function RootLayout({
    children
}: {
    children: ReactNode
}) {
    return (
        <div className="min-h-screen">
            <MainNavbar />
            {children}
            <IntroModal />
            <FeedbackModal />
            <ShowFooter />
        </div>
    )
}