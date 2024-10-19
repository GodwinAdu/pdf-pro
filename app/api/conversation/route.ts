import { openai } from "@/lib/openai";
import { NextRequest } from "next/server";
import { SendConversationValidator } from "@/lib/validators/SendConversationValidator";
import { createBotConversation, createConversation, fetchPrevConversations } from "@/lib/actions/conversation.actions";
import { currentUser } from "@/lib/helpers/current-user";

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    let user = await currentUser();

    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { sessionId,userId, message } = SendConversationValidator.parse(body);

    await createConversation({
        sessionId,
        userId,
        text: message
    });

    const prevMessages = await fetchPrevConversations({sessionId});

    const formattedPrevMessages = (prevMessages?.messages || []).map((msg) => ({
        role: msg.isUserMessage ? 'user' : 'assistant',
        content: msg.text,
    })) as { role: "user" | "assistant"; content: any }[];

    // Create chat completion with streaming enabled
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0,
        stream: true,
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant.'
            },
            ...formattedPrevMessages,
            {
                role: 'user',
                content: message
            }
        ]
    });

    let fullContent = '';  // Variable to accumulate the whole content

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            for await (const chunk of response) {
                const content = chunk.choices[0]?.delta?.content || '';

                if (content) {
                    // Accumulate content into fullContent variable
                    fullContent += content;

                    // Stream the content to the client
                    controller.enqueue(encoder.encode(content));
                }
            }

            // After the streaming ends, save the entire content at once
            await createBotConversation({
                sessionId,
                userId,
                text: fullContent.trim(),
            });

            controller.close();
        }
    });

    return new Response(stream);
};
