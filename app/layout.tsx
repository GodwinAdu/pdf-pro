import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Provider from "@/components/Provider";
import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";
import { ThemeProvider } from "@/components/theme-provider";
import Loader from "@/components/progress-bar/Loader"
import { Toaster } from "@/components/ui/toaster";
import { ModalProvider } from "@/components/group-discussion/providers/modal-provider";
import CoinPurchase from "@/components/coins/CoinPurchase";
import { currentUser } from "@/lib/helpers/current-user";
import WarningCoin from "@/components/coins/WarningCoin";
import { Analytics } from '@vercel/analytics/react';




const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eduxcel",
  description: "Created by Jutech Devs",
};

export const dynamic = 'force-dynamic'; // This forces server-side rendering

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  return (

    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `font-sans antialiased grainy `,
          inter.className
        )}
      >
        {/* <UpdateLevelAndStage user={user} /> */}
        <WarningCoin user={user} />
        <CoinPurchase user={user} />
        <ModalProvider />
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <Loader />
            {children}
            <Analytics />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
