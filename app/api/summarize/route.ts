import { openai } from "@/lib/openai";
import { NextRequest } from "next/server";
import { currentUser } from "@/lib/helpers/current-user";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    console.log(body, "body");

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
                content: `You are an advanced assistant specializing in summarizing diverse forms of content. 
                You can provide summaries that capture key points while maintaining the context of the original text. 
                Summaries should be concise but thorough, with flexibility in length (short, medium, or long) as per user’s preference. 
                You can handle various content types, such as articles, essays, reports, or technical documents. 
                Ensure the core message is retained regardless of the summary length.`
            },
            {
                role: 'user',
                content: `Summarize the following content: "${message}" in a short summary.`
            }
        ]
    });

   
    return new Response(JSON.stringify(response.choices[0].message.content), {
        headers: { 'Content-Type': 'application/json' }
    });
};
