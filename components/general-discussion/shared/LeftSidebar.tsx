"use client"

import Link from "next/link"
import { sidebarLinks } from "@/constants"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

function LeftSidebar({user}) {

    const pathname = usePathname();
    const router = useRouter();
    const userId = user?._id;

    return (
        <section className="custom-scrollbar sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-dark-4 bg-background pb-5 pt-28 max-md:hidden">
            <div className="flex w-full flex-1 flex-col gap-6 px-6 space-y-6">
                {sidebarLinks.map((link) => {
                    const isActive = (pathname.includes(`/${link.route}`) && link.route.length > 1) || pathname === link.route;

                    if (link.route === "/profile") link.route = `${link.route}/${userId}`;
                    return (
                        <Link
                            href={link.route}
                            className={`relative flex justify-start gap-4 rounded-lg p-4 ${isActive && 'bg-green-500'}`}
                            key={link.label}
                        >
                            <Image
                                src={link.imgURL}
                                alt={link.label}
                                width={24}
                                height={24}
                            />
                            <p className="text-foreground max-lg:hidden">
                                {link.label}
                            </p>
                        </Link>
                    )
                })}
            </div>
            <div className="mt-10 px-6">
                
            </div>
        </section>
    )
}

export default LeftSidebar