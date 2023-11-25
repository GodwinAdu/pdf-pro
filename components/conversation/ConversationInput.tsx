import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useContext, useRef, useState } from "react";
import { ConversationContext } from "./ConversationContext";

interface ChatInputProps {
  isDisabled?: boolean;
}

const ConversationInput = ({ isDisabled }: ChatInputProps) => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ConversationContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className=" fixed bottom-0 left-0 w-full z-50">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className={`relative ${isFocused ? "border-zinc-200" : ""}`}>
              <div className="relative">
                <div
                  className={`flex w-full border rounded text-base scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch ${
                    isFocused ? "border-zinc-200" : ""
                  }`}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                    }}
                  >
                    <Textarea
                      rows={1}
                      ref={textareaRef}
                      maxRows={4}
                      autoFocus
                      onChange={handleInputChange}
                      value={message}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          addMessage();
                          textareaRef.current?.focus();
                        }
                      }}
                      placeholder="Enter your question..."
                      className="resize-none flex-grow"
                    />
                    <Button
                      disabled={isLoading || isDisabled}
                      onClick={() => {
                        addMessage();
                        textareaRef.current?.focus();
                      }}
                      style={{
                        position: "absolute",
                        right: "0px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationInput;
