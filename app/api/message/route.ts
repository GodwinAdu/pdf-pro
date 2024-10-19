import { fetchFileById } from "@/lib/actions/file.actions";
import { createBotMessage, createMessage, fetchPrevMessages } from "@/lib/actions/message.actions";
import { openai } from "@/lib/openai";
import { getPineconeClient } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { NextRequest } from "next/server";
import { currentUser } from "@/lib/helpers/current-user";
import { fetchCoinByUserId } from "@/lib/actions/coin.actions";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

 const user = await currentUser();
 const userId = user._id;

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await fetchFileById({
    id: fileId,
    userId,
  });

  if (!file) {
    return new Response('Not found', { status: 404 });
  };
  
  const coin = await fetchCoinByUserId();

  await createMessage({
    userId,
    fileId,
    text: message,
  });

  // 1: Vectorize message
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
  });

  const pinecone = await getPineconeClient();
  const pineconeIndex = pinecone.Index('summaq');

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file._id,
  });
  
  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessages = await fetchPrevMessages({ fileId });

  const formattedPrevMessages = prevMessages?.map((msg: any) => ({
    role: msg.isUserMessage ? 'user' : 'assistant',
    content: msg.text,
  }));

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0,
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'Use the following pieces of context (or previous conversation if needed) to answer the user\'s question in markdown format.',
      },
      {
        role: 'user',
        content: `Use the following pieces of context (or previous conversation if needed) to answer the user's question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n----------------\n\nPREVIOUS CONVERSATION:\n${formattedPrevMessages?.map((message:any) => {
          if (message.role === 'user') return `User: ${message.content}\n`;
          return `Assistant: ${message.content}\n`;
        })}\n\n----------------\n\nCONTEXT:\n${results.map((r) => r.pageContent).join('\n\n')}\n\nUSER INPUT: ${message}`,
      },
    ],
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
      await createBotMessage({
        userId,
        fileId,
        text: fullContent.trim(),
      });

      controller.close();
    }
  });

  return new Response(stream);
};
