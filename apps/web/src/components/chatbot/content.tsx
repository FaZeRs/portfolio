import { createChatClientOptions } from "@tanstack/ai-client";
import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useChatHistory } from "~/hooks/use-chat-history";
import { ChatHeader } from "./header";
import { ChatInput } from "./input";
import { ChatMessages } from "./messages";

const chatOptions = createChatClientOptions({
  connection: fetchServerSentEvents("/api/chat"),
});

export function ChatbotContent({
  setIsOpen,
}: Readonly<{
  setIsOpen: (isOpen: boolean) => void;
}>) {
  const {
    messages: storedMessages,
    setMessages: setStoredMessages,
    clearHistory: clearStoredHistory,
  } = useChatHistory();

  const { messages, sendMessage, isLoading, setMessages } =
    useChat(chatOptions);

  // Restore stored messages on mount
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (hasRestoredRef.current) {
      return;
    }
    if (storedMessages.length > 0 && messages.length === 0) {
      hasRestoredRef.current = true;
      setMessages(storedMessages);
    }
  }, [storedMessages, messages, setMessages]);

  useEffect(() => {
    setStoredMessages(messages);
  }, [messages, setStoredMessages]);

  const clearHistory = () => {
    setMessages([]);
    clearStoredHistory();
  };

  return (
    <>
      <motion.div
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:bg-transparent"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
      />

      <motion.div
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="fixed inset-4 z-50 lg:inset-auto lg:right-6 lg:bottom-24 lg:h-[550px] lg:w-[420px]"
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3,
        }}
      >
        <div className="flex h-full flex-col rounded-2xl border border-border/50 bg-background/95 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl">
          <ChatHeader
            clearHistory={clearHistory}
            isLoading={isLoading}
            setIsOpen={setIsOpen}
          />
          <div className="flex min-h-0 flex-1 flex-col">
            <ChatMessages isLoading={isLoading} messages={messages} />
            <ChatInput isLoading={isLoading} sendMessage={sendMessage} />
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default ChatbotContent;
