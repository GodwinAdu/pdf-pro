import Bottombar from "@/components/general-discussion/shared/Bottombar"
import LeftSidebar from "@/components/general-discussion/shared/LeftSidebar"
import RightSidebar from "@/components/general-discussion/shared/RightSidebar"
import Topbar from "@/components/general-discussion/shared/Topbar"
import { currentUser } from "@/lib/helpers/current-user"

export default async function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const user = await currentUser();
    return (
     
        <main>
          <Topbar user={user} />
          <div className='flex flex-row'>
            <LeftSidebar user={user} />
              <section className='flex min-h-screen flex-1 flex-col items-center bg-background px-6 pb-10 pt-28 max-md:pb-32 sm:px-10'>
                <div className="w-full max-w-4xl">
                  {children}
                </div>
              </section>
            <RightSidebar />
          </div>
          <Bottombar />
        </main>
    )
  }