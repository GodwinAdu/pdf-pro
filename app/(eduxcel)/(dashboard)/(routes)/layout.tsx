
import Navbar from "@/components/user_dashboard/navbar/Navbar";
import Sidebar from "@/components/user_dashboard/sidebar/Sidebar";
import { currentUser } from "@/lib/helpers/current-user";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Created by Jutech Devs",
};

export const dynamic = 'force-dynamic'; // This forces server-side rendering
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser()
  return (

        <div className="flex min-h-screen w-full flex-col bg-muted/40 bg-white text-muted-foreground">
          <Sidebar user={user} />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <Navbar />
            <main className="px-4">
             {children}
            </main>
          </div>
        </div>
    
  );
}
