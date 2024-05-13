"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import UserAccountNav from "../UserAccountNav";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

interface MobileNavProps {
  isAuth: boolean;
  name: string;
  email: string;
  imageUrl: string;
}

const MobileNav = ({ isAuth, name, email, imageUrl }: MobileNavProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleOpen = () => setOpen((prev) => !prev);

  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) toggleOpen();
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

  return (
    <div className="sm:hidden">
      <div className="flex items-center gap-4">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <Menu
          onClick={toggleOpen}
          className="relative z-50 h-5 w-5 text-zinc-700"
        />
      </div>

      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
            {!isAuth ? (
              <>
                <li>
                  <SignedOut>
                    <SignUpButton>
                      <Button size="sm">
                        Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                      </Button>
                    </SignUpButton>
                  </SignedOut>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <SignedOut>
                    <SignInButton >
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        Sign in
                      </Button>
                    </SignInButton>
                  </SignedOut>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/admin")}
                    className="flex items-center w-full font-semibold"
                    href="/admin"
                  >
                    Admin
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/dashboard")}
                    className="flex items-center w-full font-semibold"
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/text_bot")}
                    className="flex items-center w-full font-semibold"
                    href="/text_bot"
                  >
                    Text Bot
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/projects")}
                    className="flex items-center w-full font-semibold"
                    href="/projects"
                  >
                    Projects
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/pricing")}
                    className="flex items-center w-full font-semibold"
                    href="/pricing"
                  >
                    Pricing
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNav;
