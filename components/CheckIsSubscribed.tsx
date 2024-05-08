import { updateUserSubscriptionEnd } from '@/lib/actions/user.actions';
import { isSubscriptionDue } from '@/lib/profile/subscription';
import { auth } from '@clerk/nextjs/server'


const CheckIsSubscribed = async () => {

    const { userId } = auth();

    const isSubscribedEnd = await isSubscriptionDue();
    
    console.log(isSubscribedEnd,"subscribtion end")

    if (!isSubscribedEnd) return null;

    if (isSubscribedEnd) {
        await updateUserSubscriptionEnd(userId as string);
    }
    return null
}

export default CheckIsSubscribed
