"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const ShowFooter = () => {
  const pathname = usePathname();

  const show =
    pathname.includes("/chat-ai") ||
    pathname.includes("/dashboard") ||
    pathname.includes("/projects") ||
    pathname.includes("/pricing") ||
    pathname.includes("/auth-callback")||
    pathname.includes("/text_bot") ||
    pathname.includes("/contact") ||
    pathname.includes("/settings") ;
  return (
    <>
      {!show && (
        <>
          <Footer />
        </>
      )}
    </>
  );
};

export default ShowFooter;
