


import { openai } from "@/lib/openai";

import { NextRequest } from "next/server"
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { currentUser } from "@clerk/nextjs";
import { SendConversationValidator } from "@/lib/validators/SendConversationValidator";
import { createBotConversation, createConversation, fetchPrevConversations } from "@/lib/actions/conversation.actions";


export const POST = async (req: NextRequest) => {


    const body = await req.json();

    let user = await currentUser();


    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { userId, message } = SendConversationValidator.parse(body);

    await createConversation({
        userId,
        text: message
    })



    const prevMessages = await fetchPrevConversations({ userId });

    const formattedPrevMessages = (prevMessages || []).map((msg) => ({
        role: msg.isUserMessage ? ('user' as const) : ('assistant' as const),
        content: msg.text,
    })) as { role: "user" | "assistant"; content: any; }[];

    // ...

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        stream: true,
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant.'
            },
            ...(formattedPrevMessages || []).map((message) => ({
                role: message.role,
                content: message.content
            })),
            {
                role: 'user',
                content: message
            }
        ]
    })

    console.log(formattedPrevMessages)
    const stream = OpenAIStream(response, {
        async onCompletion(completion) {
            await createBotConversation({
                userId,
                text: completion
            })
        },
    })

    return new StreamingTextResponse(stream)

}