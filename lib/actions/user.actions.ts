"use server"

import User from "../models/user.models";
import { connectToDB } from "../mongoose"
import { calculateSubscriptionEndDate } from "../utils";


export async function fetchUser({ clerkId }: { clerkId: string }) {
    await connectToDB();

    try {
        const user = await User.findOne({ clerkId }); // Pass the 'id' directly as a string
        if (!user) return null;

        return JSON.parse(JSON.stringify(user));

    } catch (error: any) {
        console.log("Unable to fetch user", error);
        throw error;
    }
}

interface createProps {
    clerkId: string;
    email: string;
    fullName: string;
}

export async function createUser({ clerkId, email, fullName }: createProps) {
    await connectToDB();

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("User already exists");
        }
        const user = new User({
            clerkId,
            email,
            fullName,
        });
        await user.save();
    } catch (error: any) {
        console.log("Unable to create user", error);
    }
}

interface SubscriptiionProps {
    id: string;
    amount: number;
    plan: string;
    period:'monthly'|'6-months'|'yearly';
}

export async function updateUserSubscription({ id, amount, plan, period }: SubscriptiionProps) {
    try {
        const date = new Date()
        const currentDate = date.toISOString().slice(0, 10);
        await connectToDB();

        const user = await User.findById(id);

        if (!user) {
            throw new Error(`User with ID ${id} not found`)
        }
        user.plan.amount += amount;
        user.plan.planName = plan;
        user.plan.subscriptionType = period;
        user.plan.subscriptionStart = currentDate;
        user.plan.subscriptionEnd = calculateSubscriptionEndDate(currentDate, period)

        await user.save();
    } catch (error) {
        console.log("Error updating user subscription:", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}