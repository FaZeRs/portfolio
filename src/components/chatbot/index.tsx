import { useChat } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ChatHeader } from "./header";
import { ChatInput } from "./input";
import { ChatMessages } from "./messages";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, status } = useChat();

  return (
    <>
      <motion.div
        animate={{ scale: 1 }}
        className="fixed right-6 bottom-6 z-50"
        initial={{ scale: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          className="h-12 w-12 rounded-full border border-primary/20 bg-gradient-to-br from-primary to-primary/80 shadow-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-primary/90 hover:to-primary/70 hover:shadow-2xl"
          onClick={() => setIsOpen(true)}
          size="lg"
        >
          <MessageCircle className="h-16 w-16 text-primary-foreground" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
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
        )}
      </AnimatePresence>
    </>
  );
}
