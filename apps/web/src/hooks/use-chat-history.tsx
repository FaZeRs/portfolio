import type { UIMessage } from "@tanstack/ai-client";
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";

const CHAT_STORAGE_KEY = "chatbot-history";
const CHAT_STORAGE_VERSION = 2;

interface ChatHistoryState {
  messages: UIMessage[];
}

function loadInitialState(): ChatHistoryState {
  if (typeof window === "undefined") {
    return { messages: [] };
  }

  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!stored) {
      return { messages: [] };
    }

    const parsed = JSON.parse(stored);

    // Version check: clear incompatible data from Vercel AI SDK format
    if (!parsed.version || parsed.version < CHAT_STORAGE_VERSION) {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      return { messages: [] };
    }

    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
    };
  } catch (_error) {
    return { messages: [] };
  }
}

const chatHistoryStore = new Store<ChatHistoryState>(loadInitialState());

chatHistoryStore.subscribe(() => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const state = chatHistoryStore.state;
    localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify({
        version: CHAT_STORAGE_VERSION,
        messages: state.messages,
      })
    );
  } catch (_error) {
    // Silently fail if localStorage is not available
  }
});

export const useChatHistory = () => {
  const messages = useStore(chatHistoryStore, (state) => state.messages);

  const setMessages = (newMessages: UIMessage[]) => {
    chatHistoryStore.setState(() => ({
      messages: newMessages,
    }));
  };

  const clearHistory = () => {
    chatHistoryStore.setState(() => ({
      messages: [],
    }));
  };

  return { messages, setMessages, clearHistory };
};
