"use server";

import Payment from "../models/payment.models";
import { connectToDB } from "../mongoose";
import { auth } from "@clerk/nextjs/server";

interface PaymentProps {
    name: string;
    amount: number;
    transaction: string;
    plan: string;
    period: string;
}
export async function sendPayment({
    name,
    amount,
    transaction,
    plan,
    period
}: PaymentProps) {
    await connectToDB();
    const {userId} = auth()

    try {
        let updatePayment;

        if (plan === 'pro') {
            updatePayment = Payment.findOneAndUpdate(
                { userId },
                {
                    userId,
                    name,
                    amountPay: amount,
                    transaction,
                    period,
                    isFree: false,
                    isPro: true,
                    isForever: false,
                    isSubscribed: true,
                    isCanceled: false
                },
                { upsert: true, new: true }
            );
        } else {
            updatePayment = Payment.findOneAndUpdate(
                { userId },
                {
                    userId,
                    name,
                    amountPay: amount,
                    transaction,
                    period,
                    isFree: false,
                    isPro: false,
                    isForever: true,
                    isSubscribed: true,
                    isCanceled: false
                },
                { upsert: true, new: true }
            );
        }

        const result = await updatePayment;
        console.log('Payment updated or inserted:', result);
    } catch (error: any) {
        console.log("Couldn't send payment", error);
    }
}

interface SubscriptionProps {
    userId: string | undefined
}

export async function getSubscription({ userId }: SubscriptionProps) {
    await connectToDB();
    try {
        const subscription = await Payment.findOne({ userId });

        if (!subscription) {
            console.log('Subscription not exist');
            return null;
        }

        return subscription

    } catch (error: any) {
        console.log('Unable to get subscription status', error)
        throw error
    }
}

export async function getSubscriptionAndUpdateStatus({ userId }: SubscriptionProps) {
    await connectToDB();
    try {
        const currentDate = new Date();

        // Find the subscription for the given user
        const subscription = await Payment.findOne({ userId });

        if (!subscription) {
            console.log('Subscription not exist');
            return null;
        }

        // Check if the subscription has expired based on the period
        // Initialize endDate to the current date
        let endDate: Date = new Date(subscription.createdAt);
        switch (subscription.period) {
            case 'monthly':
                endDate = new Date(subscription.createdAt);
                endDate.setMonth(endDate.getMonth() + 1);
                break;
            case 'half-month':
                endDate = new Date(subscription.createdAt);
                endDate.setMonth(endDate.getMonth() + 6);
                break;
            case 'yearly':
                endDate = new Date(subscription.createdAt);
                endDate.setFullYear(endDate.getFullYear() + 1);
                break;
            default:
                break;
        }

        // Check if the subscription has expired and isPro or isForever is true
        if ((currentDate >= endDate) && (subscription.isPro || subscription.isForever)) {
            // Determine which field is true and update accordingly
            const updateFields: Record<string, boolean> = {};
            if (subscription.isPro) {
                updateFields.isPro = false;
            }
            if (subscription.isForever) {
                updateFields.isForever = false;
            }

            // Update the subscription status
            const updateResult = await Payment.updateOne(
                { _id: subscription._id },
                { $set: { ...updateFields, isSubscribed: false, isCanceled: true, isFree: true } }
            );

            if (updateResult.acknowledged) {
                console.log('Subscription status updated successfully');
            } else {
                console.log('Subscription status update failed');
            }
        }

        return false;

    } catch (error: any) {
        console.log('Unable to get or update subscription status', error);
        throw error;
    }
}