import { UseChatHelpers } from "@ai-sdk/react";
import { ChatStatus, UIMessage } from "ai";
import {
  BriefcaseIcon,
  CodeSquareIcon,
  FolderIcon,
  MessageCircleIcon,
  NewspaperIcon,
  RocketIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";
import { memo, useCallback, useState } from "react";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "~/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "~/components/ai-elements/suggestion";

const portfolioSuggestions = [
  { icon: FolderIcon, text: "Show me your projects", color: "#6366f1" },
  {
    icon: NewspaperIcon,
    text: "What articles have you written?",
    color: "#10b981",
  },
  {
    icon: BriefcaseIcon,
    text: "Tell me about your experience",
    color: "#f59e0b",
  },
  { icon: RocketIcon, text: "What's your latest work?", color: "#8b5cf6" },
];

const techSuggestions = [
  { icon: CodeSquareIcon, text: "Find React projects", color: "#3b82f6" },
  { icon: CodeSquareIcon, text: "Show TypeScript articles", color: "#3078c6" },
];

const discoverySuggestions = [
  { icon: UserIcon, text: "Who are you?", color: "#06b6d4" },
  { icon: MessageCircleIcon, text: "How can I contact you?", color: "#ef4444" },
  { icon: SparklesIcon, text: "Surprise me!", color: "#ec4899" },
];

const suggestions = [
  ...portfolioSuggestions,
  ...techSuggestions,
  ...discoverySuggestions,
];

export const ChatInput = memo(function ChatInputComponent({
  sendMessage,
  status,
}: Readonly<{
  sendMessage: UseChatHelpers<UIMessage>["sendMessage"];
  status: ChatStatus;
}>) {
  const [input, setInput] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!input.trim()) {
        return;
      }
      sendMessage({ text: input.trim() });
      setInput("");
    },
    [input, sendMessage]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      sendMessage({ text: suggestion });
      setInput("");
    },
    [sendMessage]
  );

  return (
    <div className="grid shrink-0 gap-4 p-4">
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
      <Suggestions aria-label="Suggested questions" className="px-4">
        {suggestions.map(({ icon: Icon, text, color }) => (
          <Suggestion
            aria-label={`Ask: ${text}`}
            className="group font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
            key={text}
            onClick={() => handleSuggestionClick(text)}
            suggestion={text}
            variant="secondary"
          >
            <div className="flex min-w-0 items-center gap-2">
              {Icon && (
                <Icon
                  aria-hidden="true"
                  className="shrink-0 transition-transform group-hover:scale-110"
                  size={16}
                  style={{ color }}
                />
              )}
              <span className="truncate text-left">{text}</span>
            </div>
          </Suggestion>
        ))}
      </Suggestions>
    </div>
  );
});
