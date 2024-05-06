import { fetchFileById } from "@/lib/actions/file.actions";
import { createBotMessage, createMessage, fetchPrevMessages } from "@/lib/actions/message.actions";
import { openai } from "@/lib/openai";
import { getPineconeClient } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { NextRequest } from "next/server"
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { auth } from "@clerk/nextjs/server";


export const POST = async (req: NextRequest) => {


  const body = await req.json();

  const { userId } = auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await fetchFileById({
    id: fileId,
    userId
  })

  console.log(file._id)

  if (!file)
    return new Response('Not found', { status: 404 })

  await createMessage({
    userId,
    fileId,
    text: message
  })

  // 1: vectorize message
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  })

  const pinecone = await getPineconeClient()
  const pineconeIndex = pinecone.Index('summaq')

  const vectorStore = await PineconeStore.fromExistingIndex(
    embeddings,
    {
      pineconeIndex,
      namespace: file._id,
    }
  )
  const results = await vectorStore.similaritySearch(
    message,
    4
  )

  console.log(results, "results")

  const prevMessages = await fetchPrevMessages({ fileId });

  const formattedPrevMessages = prevMessages?.map((msg) => ({
    role: msg.isUserMessage
      ? ('user' as const)
      : ('assistant' as const),
    content: msg.text,
  }))

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    stream: true,
    messages: [
      {
        role: 'system',
        content:
          'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
      },
      {
        role: 'user',
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
          }  
      \n----------------\n
      
      PREVIOUS CONVERSATION:
      ${formattedPrevMessages?.map((message) => {
          if (message.role === 'user')
            return `User: ${message.content}\n`
          return `Assistant: ${message.content}\n`
        })}
      
      \n----------------\n
      
      CONTEXT:
      ${results.map((r) => r.pageContent).join('\n\n')}
      
      USER INPUT: ${message}`,
      },
    ],
  })

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await createBotMessage({
        userId,
        fileId,
        text: completion
      })
    },
  })

  return new StreamingTextResponse(stream)

}