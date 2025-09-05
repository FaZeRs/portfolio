import { ChatStatus } from "ai";
import { Bot, X } from "lucide-react";
import { Button } from "~/components/ui/button";

export function ChatHeader({
  status,
  setIsOpen,
}: Readonly<{
  status: ChatStatus;
  setIsOpen: (isOpen: boolean) => void;
}>) {
  return (
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
  );
}
