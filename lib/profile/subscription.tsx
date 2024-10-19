
import { redirect } from "next/navigation";
import { getSubscription } from "../actions/payment.actions";
import { auth } from "@clerk/nextjs/server";
import { fetchUser } from "../actions/user.actions";

export async function subscriptionProfile() {
  const  userId  = "3472349294";

  if (!userId) return redirect("/sign -in");

  const subscription = await getSubscription({ userId });

  if (!subscription) {
    console.log("Not yet a subscriber");
    return null
  }

  return subscription;
}


export async function isUserSubscribed() {
  try {
    const userId  = "3472349294";
    const currentDate = new Date();
    const userDetails = await fetchUser({ clerkId: userId as string });

    if (!userDetails) return redirect('/auth-callback');
    const subscriptionEnd = new Date(userDetails.plan.subscriptionEnd);

    // Calculate the difference in months between subscription start and end dates
    let diffMonths = (subscriptionEnd.getFullYear() - currentDate.getFullYear()) * 12;
    diffMonths -= currentDate.getMonth() + 1;
    diffMonths += subscriptionEnd.getMonth();

    if (userDetails.plan.subscriptionType === 'monthly') {
      return currentDate <= subscriptionEnd;
    } else if (userDetails.plan.subscriptionType === '6-months') {
      // Check if the current date is within 6 months of the subscription end date
      return diffMonths <= 6;
    } else if (userDetails.plan.subscriptionType === 'yearly') {
      // Check if the current date is within 12 months of the subscription end date
      return diffMonths <= 12;
    }

    return false; // Default to false if subscription type is not recognized
  } catch (error) {
    console.log("something went wrong", error)
    throw error;
  }
}

export async function isSubscriptionDue() {
  try {
    const userId  = "3472349294";
    const userDetails = await fetchUser({ clerkId: userId as string });

    // if (!userDetails) return redirect('/auth-callback');
    const now = new Date();
    const currentDate = now.toISOString().slice(0, 10)
    const subscriptionEnd = new Date(userDetails?.plan.subscriptionEnd);

    return new Date(currentDate) > subscriptionEnd;
  } catch (error) {
    console.log("something went wrong", error)
    throw error;
  }
}