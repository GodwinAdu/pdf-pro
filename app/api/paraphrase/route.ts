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

    const message = body.text;;



    // Create chat completion with streaming enabled
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0,
        stream: false,
        messages: [
            {
                role: 'system',
                content: `You are an advanced assistant specializing in paraphrasing content. 
                You can rephrase text while maintaining its original meaning, adjusting tone and complexity as needed. 
                You can handle various styles, such as casual, formal, technical, or creative. 
                Ensure that the paraphrased content is coherent, clear, and avoids repetition. Additionally, you can simplify or enhance the text based on the user’s preference (e.g., simpler language or more advanced vocabulary).`
            },
            {
                role: 'user',
                content: `Paraphrase the following text: "${message}" using a neutral tone.`
            }
        ]
    });
    
    
    return new Response(JSON.stringify(response.choices[0].message.content), {
        headers: { 'Content-Type': 'application/json' }
    });
};
