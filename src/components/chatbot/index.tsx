import { useChat } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "~/components/ai-elements/conversation";
import { Button } from "~/components/ui/button";
import { Loader } from "../ai-elements/loader";
import { Message, MessageContent } from "../ai-elements/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "../ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "../ai-elements/reasoning";
import { Response } from "../ai-elements/response";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "../ai-elements/source";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
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

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Enhanced Backdrop */}
            <motion.div
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:bg-transparent"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Modal */}
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
                {/* Chat Header */}
                <div className="flex items-center justify-between rounded-t-2xl border-border/50 border-b bg-muted/30 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/20">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-semibold text-foreground text-sm">
                        AI Assistant
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        {status === "streaming" ? "Typing..." : "Online"}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="h-8 w-8 rounded-full p-0 hover:bg-muted/80"
                    onClick={() => setIsOpen(false)}
                    size="sm"
                    variant="ghost"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Chat Content */}
                <div className="flex min-h-0 flex-1 flex-col">
                  <Conversation className="flex-1 px-4 py-2">
                    <ConversationContent className="space-y-4">
                      {messages.length === 0 && (
                        <div className="flex h-48 flex-col items-center justify-center px-4 text-center">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Bot className="h-8 w-8 text-primary" />
                          </div>
                          <h4 className="mb-2 font-medium text-foreground">
                            Start a conversation
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            Ask me anything about development, services,
                            experience, projects, booking a meeting, or anything
                            else.
                          </p>
                        </div>
                      )}

                      {messages.map((message) => (
                        <div className="space-y-2" key={message.id}>
                          {message.role === "assistant" && (
                            <Sources>
                              {message.parts.map((part, partIndex) => {
                                if (part.type === "source-url") {
                                  return (
                                    <>
                                      <SourcesTrigger
                                        count={
                                          message.parts.filter(
                                            (p) => p.type === "source-url"
                                          ).length
                                        }
                                      />
                                      <SourcesContent
                                        key={`${message.id}-${partIndex}`}
                                      >
                                        <Source
                                          href={part.url}
                                          key={`${message.id}-${partIndex}`}
                                          title={part.url}
                                        />
                                      </SourcesContent>
                                    </>
                                  );
                                }
                                return null;
                              })}
                            </Sources>
                          )}
                          <Message from={message.role} key={message.id}>
                            <MessageContent>
                              {message.parts.map((part, i) => {
                                switch (part.type) {
                                  case "text":
                                    return (
                                      <Response key={`${message.id}-${i}`}>
                                        {part.text}
                                      </Response>
                                    );
                                  case "reasoning":
                                    return (
                                      <Reasoning
                                        className="w-full"
                                        isStreaming={status === "streaming"}
                                        key={`${message.id}-${i}`}
                                      >
                                        <ReasoningTrigger />
                                        <ReasoningContent>
                                          {part.text}
                                        </ReasoningContent>
                                      </Reasoning>
                                    );
                                  default:
                                    return null;
                                }
                              })}
                            </MessageContent>
                          </Message>
                        </div>
                      ))}
                      {status === "submitted" && <Loader />}
                    </ConversationContent>
                    <ConversationScrollButton />
                  </Conversation>

                  {/* Input Area */}
                  <PromptInput className="p-4" onSubmit={handleSubmit}>
                    <div className="relative">
                      <PromptInputTextarea
                        className="max-h-32 min-h-[44px] resize-none rounded-lg border-border/50 bg-background/80 pr-12 transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        value={input}
                      />
                      <PromptInputToolbar className="absolute right-2 bottom-0">
                        <PromptInputSubmit
                          className="h-8 w-8 rounded-md p-0"
                          disabled={!input.trim()}
                          status={status}
                        />
                      </PromptInputToolbar>
                    </div>
                  </PromptInput>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
