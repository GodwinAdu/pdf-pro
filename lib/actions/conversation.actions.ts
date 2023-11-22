"use server"

import Conversation from "../models/conversation.models";
import { connectToDB } from "../mongoose"

interface CreateConversationProps{
    userId:string;
    text:string;
}
export async function createConversation({userId,text}:CreateConversationProps){
    await connectToDB();

    try {

        const conversation = new Conversation({
            userId,
            text,
            isUserMessage:true
        })

        await conversation.save();
        
    } catch (error:any) {
        console.log("error occured while creating message",error)
        throw error
    }
}
export async function createBotConversation({userId,text}:CreateConversationProps){
    await connectToDB();

    try {

        const conversation = new Conversation({
            userId,
            text,
            isUserMessage:false
        })

        await conversation.save();
        
    } catch (error:any) {
        console.log("error occured while creating message",error)
        throw error
    }
}


export async function fetchPrevConversations({userId}:{userId:string}){
    await connectToDB();
    try {
        const prevMessages = await Conversation.find({
            userId,
          }).sort({ createdAt: "desc" }).limit(2).exec();

          if(!prevMessages) return []

          return prevMessages;
    } catch (error:any) {
        console.error('MongoDB Fetch Error:', error);
    }
}

interface fetchConversationsProps{
    userId:string;
    limit:number;
    cursor:any
}

export async function fetchConversations({ userId, limit, cursor }:fetchConversationsProps) {
    await connectToDB();
    try {
        const query = Conversation.find({userId}); // Define your MongoDB query as needed
        
        if (cursor ) {
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
  