import { Editor } from "@tiptap/react";
import { BoldIcon, ItalicIcon, StrikethroughIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type EditorToolbarProps = {
  editor: Editor;
};

export default function EditorToolbar({
  editor,
}: Readonly<EditorToolbarProps>) {
  return (
    <div className="flex flex-row items-center gap-0.5 px-1.5">
      {[
        {
          name: "bold",
          icon: <BoldIcon className="size-4" />,
        },
        {
          name: "strike",
          icon: <StrikethroughIcon className="size-4" />,
        },
        {
          name: "italic",
          icon: <ItalicIcon className="size-4" />,
        },
      ].map((item) => (
        <Button
          aria-label={`Toggle ${item.name}`}
          className={cn(
            "size-7",
            editor.isActive(item.name) && "bg-accent text-accent-foreground"
          )}
          disabled={!(editor.can().toggleMark(item.name) && editor.isEditable)}
          key={item.name}
          onClick={() => editor.commands.toggleMark(item.name)}
          size="icon"
          type="button"
          variant="ghost"
        >
          {item.icon}
        </Button>
      ))}
    </div>
  );
}
