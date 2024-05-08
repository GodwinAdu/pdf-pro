import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Provider from "@/components/Provider";
import { ClerkProvider } from "@clerk/nextjs";
import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Loader from "@/components/progress-bar/Loader"
import CheckIsSubscribed from "@/components/CheckIsSubscribed";

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
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            `font-sans antialiased grainy `,
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
              <CheckIsSubscribed />
              {children}
            </ThemeProvider>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
