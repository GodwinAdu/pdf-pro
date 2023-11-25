import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getSubscription } from "../actions/payment.actions";

export async function subscriptionProfile() {
  const user = await currentUser();
  const userId = user?.id;

  if (!user) return redirect("/sign -in");

  const subscription = await getSubscription({ userId });

  if (!subscription) {
    console.log("Not yet a subscriber");
    return null
  }

  return subscription;
}
