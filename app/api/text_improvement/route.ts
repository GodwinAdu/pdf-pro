import { openai } from "@/lib/openai";
import { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { SendConversationValidator } from "@/lib/validators/SendConversationValidator";

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    let user = await currentUser();

    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const message = body.text;



    // Create chat completion with streaming enabled
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0,
        stream: false,
        messages: [
            {
                role: 'system',
                content: `You are an advanced assistant specializing in improving the quality of written text. 
                Your job is to enhance clarity, fix grammar and spelling errors, improve sentence structure, and ensure coherence. 
                You can also modify the tone, style, and vocabulary based on the user's request (e.g., making the text more formal, conversational, or creative). 
                Ensure the improved version of the text retains the original meaning while making it more polished and readable.`
            },
            {
                role: 'user',
                content: `Improve the following text: "${message}" by enhancing clarity and correcting any errors.`
            }
        ]
    });
    
    return new Response(JSON.stringify(response.choices[0].message.content), {
        headers: { 'Content-Type': 'application/json' }
    });
};
