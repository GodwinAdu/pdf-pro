"use server"

import Message from "../models/message.models";
import { connectToDB } from "../mongoose"

interface CreateMessageProps{
    userId:string;
    fileId:string;
    text:string
}
export async function createMessage({userId,fileId,text}:CreateMessageProps){
    await connectToDB();

    try {

        const message = new Message({
            userId,
            fileId,
            text,
            isUserMessage:true
        })

        await message.save();
        
    } catch (error:any) {
        console.log("error occured while creating message",error)
        throw error
    }
}
export async function createBotMessage({userId,fileId,text}:CreateMessageProps){
    await connectToDB();

    try {

        const message = new Message({
            userId,
            fileId,
            text,
            isUserMessage:false
        })

        await message.save();
        
    } catch (error:any) {
        console.log("error occured while creating message",error)
        throw error
    }
}


export async function fetchPrevMessages({fileId}:{fileId:string}){
    await connectToDB();
    try {
        const prevMessages = await Message.find({
            fileId,
          }).sort({ createdAt: "desc" }).limit(6).exec();

          return JSON.parse(JSON.stringify(prevMessages));
    } catch (error:any) {
        console.error('MongoDB Fetch Error:', error);
    }
}

interface fetchMessagesProps{
    fileId:string;
    limit:number;
    cursor:any
}

export async function fetchMessages({ fileId, limit, cursor }:fetchMessagesProps) {
    try {
        const query = Message.find({fileId}); // Define your MongoDB query as needed
        
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
      console.error('MessagesFetch Error:', error);
      throw error;
    }
  }
  