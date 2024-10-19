import { trpc } from "@/app/(eduxcel)/_trpc/client";
import { useEffect, useContext } from "react";
import { Bot, Loader2 } from "lucide-react";
import Message from "./Message";
import Skeleton from "react-loading-skeleton";
import { ConversationContext } from "./ConversationContext";

const Messages = ({ sessionId }: { sessionId: string }) => {
  const { isLoading: isAiThinking } = useContext(ConversationContext);

  // Fetch conversation data using trpc query (no infinite scrolling)
  const { data, isLoading } = trpc.getConversationsBySessionId.useQuery({
    sessionId,
  });

  // The list of conversations fetched from the API
  const conversations = data?.conversations ?? [];

  // Create a loading message to display when AI is thinking
  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  // Combine AI thinking message and conversations
  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(conversations ?? []),
  ];

  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {combinedMessages?.map((message, index) => {
        const isNextMessageSamePerson =
          index > 0 && combinedMessages[index - 1]?.isUserMessage === message?.isUserMessage;
          // console.log(combinedMessages,"complete message")

        return (
          <Message
            message={message}
            isNextMessageSamePerson={isNextMessageSamePerson}
            key={message.id}
          />
        );
      })}

      {isLoading ? (
        <div className="w-full flex flex-col gap-2 ">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : combinedMessages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center pt-40 gap-2">
          <Bot className="h-8 w-8 text-blue-500" />
          <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
          <p className="text-zinc-500 text-sm">
            Ask your first question to get started.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Messages;
