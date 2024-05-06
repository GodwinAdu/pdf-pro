import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/header/Navbar";
import Provider from "@/components/Provider";
import { ClerkProvider } from "@clerk/nextjs";
import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

import { Toaster } from "@/components/ui/toaster";
import ShowFooter from "@/components/footer/ShowFooter";
import FeedbackModal from "@/components/feedback/FeedbackModal";
import { ThemeProvider } from "@/components/theme-provider";
import IntroModal from "@/components/modal/IntroModal";
import Loader from "@/components/progress-bar/Loader"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SummaQ",
  description: "Created by Jutech Devs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            `min-h-screen font-sans antialiased grainy `,
            inter.className
          )}
        >
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              <Loader />
              <Navbar />
              {children}
              <IntroModal />
              <FeedbackModal />
              <ShowFooter />
            </ThemeProvider>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
