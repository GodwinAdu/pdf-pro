import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/(eduxcel)/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { v4 as uuidv4 } from "uuid";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface StreamResponse {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
}
export const ConversationContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  userId: string;
  sessionId: string;
  children: ReactNode;
}

interface Message {
  timestamp: string;
  id: string;
  text: string;
  isUserMessage: boolean;
}
export const ConversationContextProvider = ({ userId, children,sessionId }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const utils = trpc.useUtils();


  const backupMessage = useRef("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/conversation", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          userId,
          message,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send Message");
      }
      return response.body;
    },
    onMutate: async ({ message }) => {
      const chatSessionId = sessionId || uuidv4(); // Generate sessionId if not provided

      // If there's no sessionId, redirect to the new chat session
      if (!sessionId) {
        router.push(`/chat-ai/c/${chatSessionId}`);
      }

      backupMessage.current = message;
      setMessage("");
     

      // step 1
      await utils.getConversationsBySessionId.cancel();

      // step 2
      const previousMessages = utils.getConversationsBySessionId.getInfiniteData();

      // step 3
      utils.getConversationsBySessionId.setInfiniteData(
        { sessionId },
        (old) => {
          if (!old) {
            return {
              pages: [
                {
                  conversations: {
                    messages: [],
                    nextCursor: undefined,
                  },
                },
              ],
              pageParams: [],
            };
          }

          let newPages = [...old.pages];

          let latestPage = newPages[0];

          latestPage.conversations.messages = [
            {
              timestamp: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.conversations.messages,
          ];

          newPages[0] = latestPage;
          return {
            ...old,
            pages: newPages,
          };
        }
      );

      setIsLoading(true);

      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.conversations) ?? [],
      };
    },

    // Access pages and pageParams in your `onSuccess` function
    onSuccess: async (stream) => {
      setIsLoading(false);

      if (!stream) {
        return toast({
          title: "There was a problem sending this message",
          description: "Please refresh this page and try again",
          variant: "destructive",
        });
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // accumulated response
      let accResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        accResponse += chunkValue;

        // Append chunk to the actual message
        utils.getConversationsBySessionId.setInfiniteData(
          { sessionId },
          (old) => {
            console.log(old,"fetch old message")
            if (!old) {
              return {
                pages: [
                  {
                    conversations: {
                      messages: [
                        {
                          timestamp: new Date().toISOString(),
                          id: crypto.randomUUID(),
                          text: message,
                          isUserMessage: true,
                        },
                      ],
                    },
                  },
                ],
                pageParams: [],
              };
            }

            let isAiResponseCreated = old.pages.some((page) =>
              page.conversations.messages.some(
                (message) => message.id === "ai-response"
              )
            );

            let updatedPages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let updatedMessages;

                if (!isAiResponseCreated) {
                  updatedMessages = [
                    {
                      timestamp: new Date().toISOString(),
                      id: "ai-response",
                      text: accResponse,
                      isUserMessage: false,
                    },
                    ...page.conversations.messages,
                  ];
                } else {
                  updatedMessages = page.conversations.messages.map(
                    (message) => {
                      if (message.id === "ai-response") {
                        return {
                          ...message,
                          text: accResponse,
                        };
                      }
                      return message;
                    }
                  );
                }

                return {
                  ...page,
                  conversations: {
                    messages: updatedMessages,
                  },
                };
              }

              return page;
            });

            return { ...old, pages: updatedPages };
          }
        );
      }
    },
    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      utils.getConversationsBySessionId.setData(
        { sessionId },
        {
          conversations:
            context?.previousMessages?.map((page) => page.messages) ?? [],
        }
      );
    },
    onSettled: async () => {
      setIsLoading(false);

      await utils.getConversationsBySessionId.invalidate({ sessionId });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const addMessage = () => sendMessage({ message });
  return (
    <ConversationContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
