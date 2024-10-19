"use client"

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Bottombar(){
    const pathname = usePathname();

    return(
        <section className="fixed bottom-0 z-10 w-full rounded-t-3xl bg-black/80 p-4 backdrop-blur-lg xs:px-7 md:hidden">
            <div className="flex items-center justify-between gap-3 xs:gap-5">
            {sidebarLinks.map((link) => {
                    const isActive = (pathname.includes(`/${link.route}`) && link.route.length > 1) || pathname === link.route;
                    return (
                        <Link
                            href={link.route}
                            className={`relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5 ${isActive && 'bg-green-500'}`}
                            key={link.label}
                        >
                            <Image
                                src={link.imgURL}
                                alt={link.label}
                                width={24}
                                height={24}
                            />
                            <p className="text-subtle-medium text-white max-sm:hidden">
                                {link.label.split(/\s+/)[0]}
                            </p>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}


export default Bottombar;