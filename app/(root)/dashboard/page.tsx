import Dashboard from "@/components/dashboard/Dashboard";
import { isUserSubscribed } from "@/lib/profile/subscription";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { currentProfile } from "@/lib/profile/currentProfile";





const page = async () => {

  const { userId } = auth();

  if (!userId) redirect('/auth-callback?origin=dashboard');

  const dbUser = await currentProfile();
  if (!dbUser) redirect('/auth-callback?origin=dashboard');

  const isSubscribed = await isUserSubscribed();

  console.log(isSubscribed, "subscribed")

  return <Dashboard isSubscribed={isSubscribed} />
}

export default page
