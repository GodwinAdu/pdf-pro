"use server"

import { currentUser } from "../helpers/current-user";
import Channel from "../models/channel.models";
import GroupMessage from "../models/group-message.models";
import Member from "../models/member.models";
import Server from "../models/server.model";
import { connectToDB } from "../mongoose";
import { parseStringify } from "../utils";

interface MessageProps {
    values: {
        content: string;
        fileUrl?: string;
    }
    serverId: string;
    channelId: string;
}

export async function createGroupMessages({ values, serverId, channelId }: MessageProps) {
    try {
        const { content, fileUrl } = values;
        const user = await currentUser();

        if (!user) throw new Error('Unauthenticated user')

        if (!serverId) {
            throw new Error('Invalid server ID')
        }

        if (!channelId) {
            throw new Error('Invalid channel ID')
        }

        if (!content) {
            throw new Error('Invalid content type')
        }

        await connectToDB();

        const member = await Member.findOne({ server: serverId, userId: user._id })

        // Find the server with members including the current profile
        const server = await Server.findOne({
            _id: serverId,
            channels:channelId,
            members: member._id
        }).populate('members');

        if (!server) {
            throw new Error('Server not found or user is not a member')
        }

    
        // Find the member who posted the message
        const postedMessageMember = server.members.find((member) => member.userId.toString() === user._id);

        if (!postedMessageMember) {
            throw new Error('User is not a member of the server')
        }

        // Create the message
        const message = await GroupMessage.create({
            content,
            fileUrl,
            channelId,
            memberId: postedMessageMember._id,
        });

        const channelKey = `chat:${channelId}:messages`;

        // Emit the message to the socket
        // res?.socket?.server?.io?.emit(channelKey, message);

        return parseStringify(message);

    } catch (error) {
        console.log("Error creating group messages", error);
        throw error;
    }
}