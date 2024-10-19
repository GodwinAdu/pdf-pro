"use server"

import Member from "../models/member.models";
import { connectToDB } from "../mongoose";

export async function findMembersByServerAndProfile(serverId: string, userId: string) {
    try {
        await connectToDB()
        const members = await Member.findOne({
            server: serverId,
            userId
        })
            .populate({
                path: 'server',
                select: 'name _id' // Adjust fields to include only what you need
            })
            .populate({
                path: 'userId',
                select: 'fullName email _id' // Adjust fields to include only what you need
            })
            .lean() // Use lean() for better performance
            .exec();

        if (!members) {
            return null
        }

        return JSON.parse(JSON.stringify(members));
    } catch (error) {
        console.error("Error fetching members:", error);
        throw new Error("Internal Error");
    }
}


export async function currentMemberInServer(serverId: string, userId: string) {
    try {
        await connectToDB()
        const currentMember = await Member.findOne({
            server: serverId,     // Assuming serverId refers to the `server` field in the Member schema
            userId          // Assuming profileId refers to the `userId` field in the Member schema
        }).populate('userId');           // Populate the profile (userId refers to the User model)

        if (!currentMember) {
            return null
        };

        return JSON.parse(JSON.stringify(currentMember))

    } catch (error) {
        console.log("something went wrong", error);
        throw error;
    }
}