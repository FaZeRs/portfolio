import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import type { UIMessage } from "ai";

const CHAT_STORAGE_KEY = "chatbot-history";

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
    return {
      messages: Array.isArray(parsed) ? parsed : [],
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
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state.messages));
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
