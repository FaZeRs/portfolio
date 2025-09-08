import { useChat } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { ChatHeader } from "./header";
import { ChatInput } from "./input";
import { ChatMessages } from "./messages";

export function ChatbotContent({
  setIsOpen,
}: Readonly<{
  setIsOpen: (isOpen: boolean) => void;
}>) {
  const { messages, sendMessage, status } = useChat();

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
        className="fixed inset-4 z-50 lg:inset-auto lg:right-6 lg:bottom-24 lg:h-[650px] lg:w-[420px]"
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
          <ChatHeader setIsOpen={setIsOpen} status={status} />
          <div className="flex min-h-0 flex-1 flex-col">
            <ChatMessages messages={messages} status={status} />
            <ChatInput sendMessage={sendMessage} status={status} />
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default ChatbotContent;
