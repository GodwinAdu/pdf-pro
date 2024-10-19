import { ReactNode } from "react"
import Provider from "./Provider"
import { currentUser } from "@/lib/helpers/current-user"
export const dynamic = 'force-dynamic'; // This forces server-side rendering
export default async function RootLayout({
    children
}: {
    children: ReactNode
}) {
    const user = await currentUser()
    return (
        <div className="min-h-screen bg-[#09111f] text-white">
            <Provider user={user}>
                {children}
            </Provider>
        </div>
    )
}