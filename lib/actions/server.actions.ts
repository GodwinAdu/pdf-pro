"use server"

import { connectToDB } from "../mongoose";
import { v4 as uuidv4 } from 'uuid';
import Channel from "../models/channel.models";
import Member from "../models/member.models";

import User from "../models/user.models";
import Server from "../models/server.model";
import { currentUser } from "../helpers/current-user";
import { parseStringify } from "../utils";
import mongoose from "mongoose";
import GroupMessage from "../models/group-message.models";
import CoinTransaction from "../models/coin-transaction.models";
import Coin from "../models/coin.models";



export async function findServersByProfileId(userId: string) {
    try {
        await connectToDB();

        const members = await Member.find({ userId });

        const memberIds = members.map(member => member._id);

        const server = await Server.findOne({ members: { $in: memberIds } });

        return parseStringify(server);

    } catch (error) {
        console.error('Error finding servers:', error);
        throw error;
    }
}

export async function findServerWithChannelAndMember(serverId: string) {
    try {
        await connectToDB();

        const server = await Server.findById(serverId)
            .populate([
                {
                    path: "owner",
                    model: User,
                    select: "_id fullName imageUrl email" // Ensure only required fields are selected
                },
                {
                    path: "channels",
                    model: Channel,
                    populate: {
                        path: "userId",
                        model: User,
                        select: "_id fullName imageUrl email"
                    }
                },
                {
                    path: "members",
                    model: Member,
                    populate: {
                        path: "userId",
                        model: User,
                        select: "_id fullName imageUrl email"
                    }
                },
            ])
            .lean()  // Convert the result into plain JS objects
            .exec();

        if (!server) {
            return null
        }

        return parseStringify(server);

    } catch (error) {
        console.error('Error finding servers:', error);
        throw error;
    }
}

export async function findServersWithChannelByProfileId(userId: string) {
    try {
        await connectToDB();

        // Find member records for the given userId
        const members = await Member.find({ userId });
        const memberIds = members.map(member => member._id);

        // Find servers where these members belong and populate the fields
        const servers = await Server.find({ members: { $in: memberIds } })
            .populate([
                {
                    path: "owner",
                    model: User,
                    select: "_id fullName imageUrl email" // Ensure only required fields are selected
                },
                {
                    path: "channels",
                    model: Channel,
                    populate: {
                        path: "userId",
                        model: User,
                        select: "_id fullName imageUrl email"
                    }
                },
                {
                    path: "members",
                    model: Member,
                    populate: {
                        path: "userId",
                        model: User,
                        select: "_id fullName imageUrl email"
                    }
                },
            ])
            .lean()  // Convert the result into plain JS objects
            .exec();

        // If no servers found, return an empty array
        if (servers.length === 0) return [];

        return JSON.parse(JSON.stringify(servers));
    } catch (error) {
        console.error('Error finding servers:', error);
        throw error;
    }
}



export async function findAllServersByProfileId(userId: string) {
    try {
        await connectToDB();

        const members = await Member.find({ userId });
        const memberIds = members.map(member => member._id);
        const servers = await Server.find({ members: { $in: memberIds } });

        return parseStringify(servers);
    } catch (error) {
        console.error('Error finding servers:', error);
        throw error;
    }
}

export const findServerWithMembersByProfileId = async (serverId: string, userId: string) => {
    try {
        await connectToDB()
        const server = await Server.findById(serverId)
            .populate({
                path: 'members',
                match: { userId },  // This filters the members based on userIdId
                populate: {
                    path: 'userId',
                    model: 'User'  // Adjust the model name as needed
                }
            });

        if (!server) {
            return null
        }

        return parseStringify(server);
    } catch (error) {
        console.error("Error fetching server and members:", error);
        throw new Error("Internal Error");
    }
}



/**
 * Create a new server.
 * 
 * @param serverData The server details.
 * @returns The created server document.
 * 
 */
interface createServerProps {
    name: string,
    imageUrl: string,
}

export async function createNewServer({ name, imageUrl }: createServerProps) {
    try {
        await connectToDB();  // Connect to MongoDB
        const profile = await currentUser();

        if (!profile) {
            throw new Error("Unauthorized");
        }

        // Create the default channel
        const defaultChannel = await Channel.create({
            name: "general",
            userId: profile._id
        });

        // Create the server with the default channel
        const server = await Server.create({
            name,
            imageUrl,
            invitedCode: uuidv4(),
            channels: [defaultChannel._id],
            owner: profile._id
        });

        // Create the default member (admin) and reference the server
        const adminMember = await Member.create({
            userId: profile._id,
            role: 'ADMIN',
            server: server._id  // Reference the server in the member
        });
        const coin = await Coin.findOne({userId:profile._id})
        if(!coin || coin.coin <= 0) throw new Error("Invalid coin amount");

        coin.coin -= 10;

        const coinTransaction = new CoinTransaction({
            userId: profile._id,
            action: "DEDUCT",
            amount: 10,
            details: `Deducted for creating ${name} server`
        })

        // Associate the member with the server
        server.members.push(adminMember._id);

        await Promise.all([
            coin.save(),
            coinTransaction.save(),
            server.save()
        ]);


        return parseStringify(server);
    } catch (error) {
        console.log("[SERVERS_POST]", error);
        throw new Error("Internal Error");
    }
}


export async function findServerWithInvitedCodeAndUserId(invitedCode: string, userId: string) {
    try {
        await connectToDB();

        const server = await Server.findOne({
            invitedCode,
            members: { $elemMatch: { userId } },
        });

        if (!server) {
            return null;
        }

        return JSON.parse(JSON.stringify(server));

    } catch (error) {
        console.log("unable to find server", error);
        throw error;
    }
}


export async function updateServerWithInvitedCode(invitedCode: string, userId: string) {
    try {
        await connectToDB();

        // Convert userId to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId); // Use 'new' keyword here

        // Update the server, adding the userObjectId to the members array
        const server = await Server.findOne({ invitedCode })

        // Create the default member (admin) and reference the server
        const addMember = await Member.create({
            userId: userObjectId,
            server: server._id  // Reference the server in the member
        });

        // Associate the member with the server
        server.members.push(addMember._id);
        await server.save();

        return JSON.parse(JSON.stringify(server));
    } catch (error) {
        console.error("Error updating server with invited code:", error);
        throw error;
    }
};



// Helper function to delete a server and its related members and channels
export async function deleteServer(serverId: string) {
    try {
        await connectToDB();
        // Find the server by its ID
        const server = await Server.findById(serverId);

        if (!server) {
            throw new Error("Server not found");
        }

        const channelIds = server.channels;

        await Promise.all([
            Member.deleteMany({ server: serverId }),
            Channel.deleteMany({ _id: { $in: channelIds } }),
            GroupMessage.deleteMany({ channelId: { $in: channelIds } }),
            Server.findByIdAndDelete(serverId)
        ]);

        return true;
    } catch (error) {
        console.error("Error deleting server: ", error);
        throw error;
    }
}


export async function updateServer(values: { name: string, imageUrl: string }, serverId: string) {
    try {
        await connectToDB();

        // Update the server
        const updatedServer = await Server.findByIdAndUpdate(
            serverId,
            {
                $set: { ...values }  // Spread the values to update the individual fields
            },
            { new: true }  // Return the updated document
        );

        return JSON.parse(JSON.stringify(updatedServer));  // Ensure proper JSON formatting
    } catch (error) {
        console.error("Error updating server: ", error);
        throw error;
    }
}


export async function leaveServer(serverId: string) {
    try {
        await connectToDB();
        const user = await currentUser();

        if (!user) {
            throw new Error("Unauthorized");
        }

        if (!serverId) {
            throw new Error("Server not found");
        }

        console.log(`Leaving server with ID: ${serverId} for user: ${user._id}`);

        // Find the member to leave
        const memberToLeave = await Member.findOne({ server: serverId, userId: user._id });

        if (!memberToLeave) {
            throw new Error("User is not a member of this server");
        }

        // Find the server and remove the member
        const server = await Server.findOneAndUpdate(
            {
                _id: serverId,
                owner: { $ne: user._id }, // Ensure the user is not the owner
                members: memberToLeave._id // Check if the member is part of the members
            },
            {
                $pull: { members: memberToLeave._id } // Remove the member from the server
            },
            { new: true }
        );

        if (!server) {
            throw new Error("Server not found or user is not a member");
        }

        // Remove the member record
        await Member.findOneAndDelete({ server: serverId, userId: user._id });

        return JSON.parse(JSON.stringify(server));
    } catch (error) {
        console.log("An error occurred:", error);
        throw error;
    }
}
