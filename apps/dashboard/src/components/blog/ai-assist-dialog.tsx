import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { Textarea } from "@acme/ui/textarea";
import { useCompletion } from "@ai-sdk/react";
import { SparklesIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type AIAssistType =
  | "title"
  | "description"
  | "tags"
  | "content"
  | "outline"
  | "expand";

interface AIAssistDialogProps {
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonVariant?: "default" | "outline" | "ghost";
  className?: string;
  context?: {
    topic?: string;
    title?: string;
    description?: string;
    currentContent?: string;
    selectedText?: string;
    tags?: string[];
  };
  description: string;
  label: string;
  onApply: (content: string) => void;
  type: AIAssistType;
}

const ASSIST_LABELS: Record<AIAssistType, string> = {
  title: "Generate Titles",
  description: "Generate Description",
  tags: "Suggest Tags",
  content: "Generate Content",
  outline: "Create Outline",
  expand: "Expand Section",
};

const TITLE_PATTERN = /^\d+\./;
const TITLE_REPLACE_PATTERN = /^\d+\.\s*/;

function getPlaceholder(type: AIAssistType): string {
  switch (type) {
    case "title":
      return "E.g., Building a full-stack app with React and Node.js";
    case "description":
      return "Describe what your article covers...";
    case "tags":
      return "What topics does your article cover?";
    case "content":
      return "What should this article be about?";
    case "outline":
      return "What should this article be about?";
    case "expand":
      return "Which section do you want to expand?";
    default:
      return "Describe your topic...";
  }
}

export function AIAssistDialog({
  type,
  label,
  description,
  context = {},
  onApply,
  className,
  buttonVariant = "outline",
  buttonSize = "sm",
}: AIAssistDialogProps) {
  const [open, setOpen] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  const { completion, complete, isLoading, stop, setCompletion } =
    useCompletion({
      api: "/api/ai/blog-assist",
      body: {
        type,
        context: {
          ...context,
          topic: userPrompt || context.topic,
        },
      },
      onError: (error) => {
        toast.error(`Failed to generate content: ${error.message}`);
      },
    });

  // Parse titles when completion changes and type is title
  const titles =
    type === "title" && completion
      ? completion
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => TITLE_PATTERN.test(line))
          .map((line) => line.replace(TITLE_REPLACE_PATTERN, ""))
      : [];

  // Auto-select first title when titles are generated
  useEffect(() => {
    if (titles.length > 0 && !selectedTitle) {
      setSelectedTitle(titles[0] ?? "");
    }
  }, [titles, selectedTitle]);

  const handleGenerate = () => {
    complete(userPrompt || context.topic || "");
  };

  const handleRegenerate = () => {
    setCompletion("");
    setSelectedTitle("");
    complete(userPrompt || context.topic || "");
  };

  const handleApply = () => {
    const contentToApply = type === "title" ? selectedTitle : completion;
    if (contentToApply) {
      onApply(contentToApply);
      setOpen(false);
      setUserPrompt("");
      setCompletion("");
      setSelectedTitle("");
    }
  };

  const handleClose = () => {
    if (isLoading) {
      stop();
    }
    setOpen(false);
    setUserPrompt("");
    setCompletion("");
    setSelectedTitle("");
  };

  // Reset completion when dialog closes
  useEffect(() => {
    if (!open) {
      setCompletion("");
      setSelectedTitle("");
    }
  }, [open, setCompletion]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          className={cn("gap-2", className)}
          size={buttonSize}
          type="button"
          variant={buttonVariant}
        >
          <SparklesIcon className="h-4 w-4" />
          {label || ASSIST_LABELS[type]}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] max-w-3xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-primary" />
            {ASSIST_LABELS[type]}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {/* Input section */}
          <div className="space-y-2">
            <label
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="ai-prompt"
            >
              What would you like help with?
            </label>
            <Textarea
              className="resize-none"
              id="ai-prompt"
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder={getPlaceholder(type)}
              rows={3}
              value={userPrompt}
            />
          </div>

          {/* AI Response */}
          {completion && type === "title" && titles.length > 0 && (
            <div className="space-y-2">
              <span className="font-medium text-sm leading-none">
                Choose a Title
              </span>
              <div className="space-y-2">
                {titles.map((title) => (
                  <button
                    className={cn(
                      "w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50",
                      selectedTitle === title
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border"
                    )}
                    key={title}
                    onClick={() => setSelectedTitle(title)}
                    type="button"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 transition-colors",
                          selectedTitle === title
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        )}
                      >
                        {selectedTitle === title && (
                          <div className="h-full w-full rounded-full bg-background p-0.5">
                            <div className="h-full w-full rounded-full bg-primary" />
                          </div>
                        )}
                      </div>
                      <span className="flex-1 text-sm">{title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {completion && type !== "title" && (
            <div className="space-y-2">
              <span className="font-medium text-sm leading-none">
                AI Suggestion
              </span>
              <div className="max-h-[400px] overflow-y-auto rounded-md border bg-muted/50 p-4">
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {completion}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            disabled={isLoading}
            onClick={handleClose}
            type="button"
            variant="outline"
          >
            {isLoading ? "Stop" : "Cancel"}
          </Button>
          {completion && (
            <>
              <Button
                className="gap-2"
                disabled={isLoading}
                onClick={handleRegenerate}
                type="button"
                variant="outline"
              >
                <SparklesIcon className="h-4 w-4" />
                Regenerate
              </Button>
              <Button
                disabled={isLoading}
                onClick={handleApply}
                type="button"
                variant="default"
              >
                Apply to Form
              </Button>
            </>
          )}
          {!completion && (
            <Button
              className="gap-2"
              disabled={isLoading || !userPrompt.trim()}
              onClick={handleGenerate}
              type="button"
              variant="default"
            >
              {isLoading ? (
                <>
                  <SparklesIcon className="h-4 w-4 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
