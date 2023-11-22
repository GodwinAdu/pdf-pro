import Dashboard from "@/components/dashboard/Dashboard";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { subscriptionProfile } from "@/lib/profile/subscription";
import { redirect } from "next/navigation";




const page = async () => {
   
    const user = await currentUser();

    if(!user || !user.id) redirect("/auth-callback?origin=dashboard");

    const dbUser = await fetchUser({
      id:user.id,
    })
    if(!dbUser) redirect("/auth-callback?origin=dashboard");

    const subscriptionPlan = await subscriptionProfile();
    const  isSubscribed  = (subscriptionPlan.isSubscribed && subscriptionPlan.isPro) 
  return <Dashboard isSubscribed={isSubscribed} />
}

export default page
