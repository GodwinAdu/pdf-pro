"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import menuData from "./menuData";
import MaxWidthWrapper from "../common/MaxWidthWrapper";
import UserAccountNav from "../UserAccountNav";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { Outline } from "react-pdf";

const Navbar = ({ user }: any) => {
  const pathname = usePathname();

  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => {
      window.removeEventListener("scroll", handleStickyNavbar);
    };
  }, []);

  // Submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  // Check if the menu or submenu path is active
  const isActive = (path) => pathname === path;

  // Check if any of the submenu items are active
  const isSubmenuActive = (submenu) => submenu.some((item) => isActive(item.path));

  return (
    <>
      <header
        className={`sticky inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all ${sticky
          ? "!fixed !z-[9999] !bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm !transition dark:!bg-primary dark:!bg-opacity-20"
          : "absolute"
          }`}
      >
        <MaxWidthWrapper>
          <div className="flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link
                href="/"
                className={`header-logo block ${sticky ? "py-5 lg:py-2" : "py-8"}`}
              >
                <p className="font-poppins font-bold xs:text-[20.45px] text-[15.45px] xs:leading-[26.58px] leading-[21.58px] text-gradient">EduxcelMaster</p>
              </Link>
            </div>
            <div className="flex gap-5">
              <div>
                <div className="flex items-center justify-end gap-4">
                  <button
                    onClick={navbarToggleHandler}
                    id="navbarToggler"
                    aria-label="Mobile Menu"
                    className="block lg:hidden relative z-50 items-center"
                  >
                    <span
                      className={`block h-0.5 w-6 bg-black dark:bg-white transition-all ${navbarOpen ? "rotate-45 translate-y-2" : ""}`}
                    ></span>
                    <span
                      className={`block h-0.5 w-6 my-1 bg-black dark:bg-white transition-all ${navbarOpen ? "opacity-0" : ""}`}
                    ></span>
                    <span
                      className={`block h-0.5 w-6 bg-black dark:bg-white transition-all ${navbarOpen ? "-rotate-45 -translate-y-2" : ""}`}
                    ></span>
                  </button>
                </div>
                <nav
                  id="navbarCollapse"
                  className={`absolute right-0 z-30 rounded border-[.5px] border-body-color/50 bg-white py-4 px-6 duration-300 dark:border-body-color/20 dark:bg-dark lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${navbarOpen
                    ? "visibility top-full opacity-100"
                    : "invisible top-[120%] opacity-0"
                    }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {user ? (
                      menuData.map((menuItem, index) => (
                        <li key={menuItem.id} className="group relative">
                          {menuItem.path ? (
                            <Link
                              onClick={() => setNavbarOpen(false)}
                              href={menuItem.path}
                              className={`flex py-2 text-dark text-sm group-hover:opacity-70 dark:text-white lg:mr-0 lg:inline-flex lg:py-6 lg:px-0 ${isActive(menuItem.path) ? "text-gradient font-bold" : ""
                                }`}
                            >
                              {menuItem.title}
                            </Link>
                          ) : (
                            <>
                              <a
                                onClick={() => handleSubmenu(index)}
                                className={`flex cursor-pointer items-center justify-between py-2 text-sm text-dark group-hover:opacity-70 dark:text-white lg:mr-0 lg:inline-flex lg:py-6 lg:px-0 ${isSubmenuActive(menuItem.submenu) ? "text-gradient font-bold" : ""
                                  }`}
                              >
                                {menuItem.title}
                                <span className="pl-3">
                                  <svg width="15" height="14" viewBox="0 0 15 14">
                                    <path
                                      d="M7.81602 9.97495C7.68477 9.97495 7.57539 9.9312 7.46602 9.8437L2.43477 4.89995C2.23789 4.70308 2.23789 4.39683 2.43477 4.19995C2.63164 4.00308 2.93789 4.00308 3.13477 4.19995L7.81602 8.77183L12.4973 4.1562C12.6941 3.95933 13.0004 3.95933 13.1973 4.1562C13.3941 4.35308 13.3941 4.65933 13.1973 4.8562L8.16601 9.79995C8.05664 9.90933 7.94727 9.97495 7.81602 9.97495Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                </span>
                              </a>
                              <div
                                className={`submenu relative top-full left-0 rounded-md bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${openIndex === index ? "block" : "hidden"
                                  }`}
                              >
                                {menuItem?.submenu?.map((submenuItem) => (
                                  <Link
                                    onClick={() => setNavbarOpen(false)}
                                    href={submenuItem.path}
                                    key={submenuItem.id}
                                    className={`block rounded py-2.5 text-xs text-dark hover:opacity-70 dark:text-white lg:px-3 ${isActive(submenuItem.path) ? "text-gradient font-bold" : ""
                                      }`}
                                  >
                                    {submenuItem.title}
                                  </Link>
                                ))}
                              </div>
                            </>
                          )}
                        </li>
                      ))
                    ) : (
                      <>
                        <li>
                          <Link
                            onClick={() => setNavbarOpen(false)}
                            href="/sign-in"
                            className={cn(buttonVariants({ size: "sm" }))}
                          >
                            Get Started
                          </Link>
                        </li>
                        <li>
                          <Link
                            onClick={() => setNavbarOpen(false)}
                            href="/sign-in"
                            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                          >
                            Sign In
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </nav>
              </div>
            </div>
            <div className="">
              {user && <UserAccountNav user={user} />}
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </>
  );
};

export default Navbar;
