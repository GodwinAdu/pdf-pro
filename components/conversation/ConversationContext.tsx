import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { v4 as uuidv4 } from "uuid";
import { usePathname, useRouter } from "next/navigation";

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
  children: ReactNode;
}

interface Message {
  createdAt: string;
  id: string;
  text: string;
  isUserMessage: boolean;
}
export const ConversationContextProvider = ({ userId, children }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const utils = trpc.useContext();

  const { toast } = useToast();

  const backupMessage = useRef("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/conversation", {
        method: "POST",
        body: JSON.stringify({
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
      backupMessage.current = message;
      setMessage("");
     

      // step 1
      await utils.getConversations.cancel();

      // step 2
      const previousMessages = utils.getConversations.getInfiniteData();

      // step 3
      utils.getConversations.setInfiniteData(
        { userId, limit: INFINITE_QUERY_LIMIT },
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
              createdAt: new Date().toISOString(),
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
        utils.getConversations.setInfiniteData(
          { userId, limit: INFINITE_QUERY_LIMIT },
          (old) => {
            if (!old) {
              return {
                pages: [
                  {
                    conversations: {
                      messages: [
                        {
                          createdAt: new Date().toISOString(),
                          id: crypto.randomUUID(),
                          text: message,
                          isUserMessage: true,
                        },
                      ],
                      nextCursor: undefined,
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
                      createdAt: new Date().toISOString(),
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
                    nextCursor: undefined, // You may need to update this based on your data
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
      utils.getConversations.setData(
        { userId },
        {
          conversations:
            context?.previousMessages?.map((page) => page.messages) ?? [],
          nextCursor: undefined, // You may need to adjust this based on your data structure
        }
      );
    },
    onSettled: async () => {
      setIsLoading(false);

      await utils.getConversations.invalidate({ userId });
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
