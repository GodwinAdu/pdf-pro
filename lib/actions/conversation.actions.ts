"use server"

import Conversation from "../models/conversation.models";
import { connectToDB } from "../mongoose"

interface CreateConversationProps {
    userId: string;
    sessionId: string;
    text: string;
}
export async function createConversation({ sessionId, userId, text }: CreateConversationProps) {
    try {
        await connectToDB();

        // Define the new message object
        const newMessage = {
            text,
            isUserMessage: true,
            timestamp: new Date(), // Add timestamp if needed
        };

        // Check if a conversation already exists for the given sessionId and userId
        let conversation = await Conversation.findOne({ sessionId, userId });

        if (conversation) {
            // If it exists, push the new message to the existing messages array
            conversation.messages.push(newMessage);
        } else {
            // If it doesn't exist, create a new conversation with the message
            conversation = new Conversation({
                userId,
                sessionId,
                messages: [newMessage], // Initialize with the new message in an array
            });
        }

        // Save the conversation (either updated or new)
        await conversation.save();

    } catch (error: any) {
        console.log("error occurred while creating message", error)
        throw error
    }
}
export async function createBotConversation({ sessionId, userId, text }: CreateConversationProps) {
    try {
        await connectToDB();

        // Define the new message object
        const newMessage = {
            text,
            isUserMessage: false,
        };

        // Check if a conversation already exists for the given sessionId and userId
        let conversation = await Conversation.findOne({ sessionId, userId });

        if (conversation) {
            // If it exists, push the new message to the existing messages array
            conversation.messages.push(newMessage);
        } else {
            // If it doesn't exist, create a new conversation with the message
            conversation = new Conversation({
                userId,
                sessionId,
                messages: [newMessage], // Initialize with the new message in an array
            });
        }

        // Save the conversation (either updated or new)
        await conversation.save();

    } catch (error: any) {
        console.log("error occurred while creating message", error)
        throw error
    }
}


export async function fetchPrevConversations({ sessionId}: { sessionId: string}) {
    await connectToDB();
    try {
        const prevMessages = await Conversation.findOne({
            sessionId
        }).sort({ createdAt: "desc" }).limit(2).exec();

        if (!prevMessages) return []

        return JSON.parse(JSON.stringify(prevMessages));
    } catch (error: any) {
        console.error('MongoDB Fetch Error:', error);
        throw error;
    }
}

interface fetchConversationsProps {
    userId: string;
    limit: number;
    cursor: any
}

export async function fetchConversations({ userId, limit, cursor }: fetchConversationsProps) {
    await connectToDB();
    try {
        const query = Conversation.find({ userId }); // Define your MongoDB query as needed

        if (cursor) {
            query.where({ _id: { $lt: cursor } }); // Use _id for comparison
        };


        const messages = await query
            .select('text isUserMessage createdAt') // Define the fields you want to select
            .sort({ createdAt: 'desc' }) // Sort by createdAt in ascending order
            .limit(limit + 1) // Get an extra item at the end for the next cursor

        let nextCursor: string | undefined = undefined;
        if (messages.length > limit) {
            const nextItem = messages.pop();
            nextCursor = nextItem.id;
        }


        return {
            messages,
            nextCursor,
        };

    } catch (error) {
        console.error('Mongoose Fetch Error:', error);
    }
}
