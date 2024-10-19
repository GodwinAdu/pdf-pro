"use server"

import { currentUser } from "../helpers/current-user";
import Coin from "../models/coin.models";
import { connectToDB } from "../mongoose";
import CoinTransaction from '../models/coin-transaction.models';


export async function buyCoin(userId: string, reference: string, amount: number) {
    try {

        await connectToDB();

        // Check if the user has enough coins
        const coin = await Coin.findOne({ userId });

        if (!coin) {
            throw new Error("User does not have coins Account.");
        }
        const coinTransaction = new CoinTransaction({
            userId,
            action: "BUY",
            amount:amount * 2,
            details: `You purchase ${amount * 2} coins, Here is your reference id ${reference}`
        })

        // Deduct one coin from the user's balance
        coin.coin += amount * 2;
        await Promise.all([
            coinTransaction.save(),
            coin.save()
        ]);

        return { message: "Coin purchased successfully." };

    } catch (error) {
        console.log("failing to buyCoin", error);
        throw error;
    }
}


export async function fetchCoinByUserId() {
    try {
        const user = await currentUser();

        if (!user) throw new Error("User not found");

        const userId = user._id;

        await connectToDB();

        const coin = await Coin.findOne({ userId })

        if (!coin) return 0;

        return coin.coin

    } catch (error) {
        console.log("failing to fetchCoinByUserId", error);
        throw error;
    }
}


export async function deductCoinByPdfPages(page: number, userId: string) {
    try {
        // Validate the page input
        if (!page || page <= 0) {
            throw new Error("Invalid number of pages specified.");
        }

        await connectToDB()

        // Find the user's coin balance
        const coin = await Coin.findOne({ userId });

        if (!coin) {
            throw new Error("User does not have a coin balance.");
        }

        // Check if the user has enough coins
        if (page > coin.coin) {
            throw new Error("Insufficient coins for the requested page deduction.");
        }

        // Deduct the number of pages from the user's coin balance
        coin.coin -= page;
        await coin.save();

    } catch (error) {
        console.error("Failed to deduct coins by PDF pages:", error);
        throw error;
    }
}
