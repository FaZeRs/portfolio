import { ChatStatus, UIMessage } from "ai";
import { Bot } from "lucide-react";
import { memo } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "~/components/ai-elements/conversation";
import { Loader } from "~/components/ai-elements/loader";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "~/components/ai-elements/source";
import { ChatMessage } from "./message";

export const ChatMessages = memo(function ChatMessagesComponent({
  messages,
  status,
}: Readonly<{
  messages: UIMessage[];
  status: ChatStatus;
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
            {message.role === "assistant" && (
              <Sources>
                {message.parts.map((part, partIndex) => {
                  if (part.type === "source-url") {
                    return (
                      <>
                        <SourcesTrigger
                          count={
                            message.parts.filter((p) => p.type === "source-url")
                              .length
                          }
                        />
                        <SourcesContent key={`${message.id}-${partIndex}`}>
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
            <ChatMessage message={message} status={status} />
          </div>
        ))}
        {status === "submitted" && <Loader />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
});
