import { UseChatHelpers } from "@ai-sdk/react";
import { ChatStatus, UIMessage } from "ai";
import { useState } from "react";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "~/components/ai-elements/prompt-input";

export function ChatInput({
  sendMessage,
  status,
}: {
  sendMessage: UseChatHelpers<UIMessage>["sendMessage"];
  status: ChatStatus;
}) {
  const [input, setInput] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };
  return (
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
  );
}
