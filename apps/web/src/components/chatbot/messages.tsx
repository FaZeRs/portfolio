import type { UIMessage } from "@tanstack/ai-client";
import { Bot } from "lucide-react";
import { memo } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "~/components/ai-elements/conversation";
import { Loader } from "~/components/ai-elements/loader";
import { ChatMessage } from "./message";

export const ChatMessages = memo(function ChatMessagesComponent({
  messages,
  isLoading,
}: Readonly<{
  messages: UIMessage[];
  isLoading: boolean;
}>) {
  return (
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
              Ask me anything about development, services, experience, projects,
              booking a meeting, or anything else.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div className="space-y-2" key={message.id}>
            <ChatMessage isLoading={isLoading} message={message} />
          </div>
        ))}
        {isLoading && messages.at(-1)?.role === "user" && <Loader />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
});
