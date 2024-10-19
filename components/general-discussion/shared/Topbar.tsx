
import UserAccountNav from "@/components/UserAccountNav"
import Image from "next/image"
import Link from "next/link"


function Topbar({user}) {
    return (
        <nav className="fixed top-0 flex justify-between items-center z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg p-4">
            <Link href='/general_discussion' className="flex items-center gap-4">
                 <p className="text-2xl text-foreground font-bold max-xs:hidden">Discussion Forum</p>
            </Link>


            <div className="flex items-center gap-1">
               <UserAccountNav user={user} />
            </div>
        </nav>
    )
}


export default Topbar