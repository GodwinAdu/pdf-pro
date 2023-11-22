import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getSubscriptionAndUpdateStatus } from "../actions/payment.actions";
import cron from 'node-cron';



cron.schedule('*/10 * * * *', async () => {
    const user = await currentUser();
    if (!user) return redirect('/sign-in');
    const userId = user?.id;
    try {
        const result = await getSubscriptionAndUpdateStatus({ userId });
        console.log(`Subscription status check completed. Update successful: ${result}`);
    } catch (error) {
        console.error('Error during subscription status check:', error);
    }
});