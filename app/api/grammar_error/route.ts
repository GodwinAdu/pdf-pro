import { openai } from "@/lib/openai";
import { NextRequest } from "next/server";

import { SendConversationValidator } from "@/lib/validators/SendConversationValidator";
import { currentUser } from "@/lib/helpers/current-user";

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
                content: `You are a highly specialized assistant that focuses solely on grammar checking. 
                Your task is to review the provided text, identify grammatical errors, and correct them. 
                Do not change the tone, style, or meaning of the text. Focus only on correcting grammar, punctuation, and syntax issues without altering the original message.`
            },
            {
                role: 'user',
                content: `Check the following text for grammar errors and correct them: "${message}".`
            }
        ]
    });
    
    
    return new Response(JSON.stringify(response.choices[0].message.content), {
        headers: { 'Content-Type': 'application/json' }
    });
};
