"use server"

import User from "../models/user.models";
import { connectToDB } from "../mongoose"


export async function fetchUser({ id }: { id: string }) {
    await connectToDB();

    try {
        const user = await User.findOne({id:id}); // Pass the 'id' directly as a string
        if (!user) return null;

        return user;
        
    } catch (error: any) {
        console.log("Unable to fetch user", error);
    }
}

interface createProps{
    id:string;
    email:string;
    name:string;
    // phone:string;
}

export async function createUser({ id, email,name}: createProps) {
    await connectToDB();

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("User already exists");
        }
        const user = new User({
            id,
            email,
            name,
            // phone,
        });
        await user.save();
    } catch (error: any) {
        console.log("Unable to create user", error);
    }
}
