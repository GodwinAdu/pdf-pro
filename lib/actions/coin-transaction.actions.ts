"use server"

import { currentUser } from "../helpers/current-user"
import CoinTransaction from "../models/coin-transaction.models";
import Coin from "../models/coin.models";
import { connectToDB } from "../mongoose";
import { parseStringify } from "../utils";



export async function fetchCoinTransactions(){
    try {
        const user =  await currentUser();

        if(!user) throw new Error("Unauthenticated");

        await connectToDB();

        const transactions = await CoinTransaction.find({userId:user._id})

        if(transactions.length === 0) return [];

        return parseStringify(transactions);

    } catch (error) {
        console.log('Error in fetching transaction',error);
        throw error;
    }
}


export async function fetchCoinByUserId(userId:string) {
    try {
        await connectToDB();
        const coin = await Coin.findOne({userId})

        if(!coin) return null;

        return parseStringify(coin)
    } catch (error) {
        console.log("Something went wrong",error);
        throw error;
    }
    
}