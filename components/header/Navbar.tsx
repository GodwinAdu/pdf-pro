import Link from "next/link";
import MaxWidthWrapper from "../common/MaxWidthWrapper";
import { Button, buttonVariants } from "../ui/button";

import { ArrowRight } from "lucide-react";
import UserAccountNav from "../UserAccountNav";
import MobileNav from "./MobileNav";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const Navbar = async () => {
  const user = await currentUser();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span>SummaQ.</span>
          </Link>

          <div className="flex gap-5 items-center">
            <MobileNav
              isAuth={!!user}
              name={
                !user?.firstName || !user?.lastName
                  ? "Your Account"
                  : `${user?.firstName} ${user?.lastName}`
              }
              email={user?.emailAddresses[0].emailAddress ?? ""}
              imageUrl={user?.imageUrl ?? ""}
            />

            <div className="hidden items-center space-x-4 sm:flex">
              {!user ? (
                <>
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
                  <SignedOut>
                    <SignUpButton>
                      <Button size="sm">
                        Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                      </Button>
                    </SignUpButton>
                  </SignedOut>
                </>
              ) : (
                <>
                  <Link
                    href="/admin"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Admin
                  </Link>
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/text_bot"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Text Bot
                  </Link>
                  <Link
                    href="/projects"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Projects
                  </Link>
                  <Link
                    href="/pricing"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Pricing
                  </Link>

                  <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </>
              )}
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
