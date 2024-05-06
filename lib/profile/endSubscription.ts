
import { redirect } from "next/navigation";
import { getSubscriptionAndUpdateStatus } from "../actions/payment.actions";
import cron from 'node-cron';
import { auth } from "@clerk/nextjs/server";



cron.schedule('*/10 * * * *', async () => {
    const {userId} = auth();
    
    if (!userId) return redirect('/sign-in');
    
    try {
        const result = await getSubscriptionAndUpdateStatus({ userId });
        console.log(`Subscription status check completed. Update successful: ${result}`);
    } catch (error) {
        console.error('Error during subscription status check:', error);
    }
});