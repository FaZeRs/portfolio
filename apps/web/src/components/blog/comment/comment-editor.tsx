import { cn } from "@acme/ui";
import { Bold } from "@tiptap/extension-bold";
import { Document } from "@tiptap/extension-document";
import { Italic } from "@tiptap/extension-italic";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Strike } from "@tiptap/extension-strike";
import { Text } from "@tiptap/extension-text";
import { Editor, EditorContent, type JSONContent } from "@tiptap/react";
import { useEffect, useState } from "react";
import EditorToolbar from "./editor-toolbar";

interface CommentEditorProps {
  autofocus?: boolean;
  content?: JSONContent;
  disabled?: boolean;
  editable?: boolean;
  editor: UseCommentEditor | null;
  onChange?: (editor: UseCommentEditor) => void;
  placeholder?: string;
}

interface UseCommentEditor {
  clearValue: () => void;
  editor: Editor;
  getValue: () => JSONContent;
  isEmpty: boolean;
}

export const useCommentEditor = (): [
  editor: UseCommentEditor | null,
  setEditor: (editor: UseCommentEditor) => void,
] => useState<UseCommentEditor | null>(null);

const createCommentEditor = (editor: Editor): UseCommentEditor => ({
  editor,
  get isEmpty() {
    return editor.isEmpty;
  },
  getValue() {
    return editor.getJSON();
  },
  clearValue() {
    editor.commands.clearContent(true);
  },
});

export default function CommentEditor({
  editor,
  placeholder,
  content,
  onChange,
  autofocus = false,
  editable = true,
  disabled = false,
}: Readonly<CommentEditorProps>) {
  const innerEditor = editor?.editor ?? null;

  const editorClassName = cn(
    "rounded-lg border bg-background pb-1 ring-offset-background",
    "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
    "aria-disabled:cursor-not-allowed aria-disabled:opacity-80"
  );

  const tiptapClassName = cn(
    "focus-visible:outline-none",
    editable && "min-h-10 px-3 py-2"
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: we don't want to re-create the editor on every render
  useEffect(() => {
    // Update existing editor
    if (innerEditor) {
      innerEditor.setOptions({
        editable,
        editorProps: {
          attributes: {
            class: tiptapClassName,
          },
        },
      });
      if (
        content &&
        JSON.stringify(innerEditor.getJSON()) !== JSON.stringify(content)
      ) {
        innerEditor.commands.setContent(content);
      }
      return;
    }

    const instance = new Editor({
      extensions: [
        Bold,
        Document,
        Italic,
        Paragraph,
        Strike,
        Text,
        Placeholder.configure({
          placeholder,
          showOnlyWhenEditable: false,
        }),
      ],
      autofocus,
      content,
      editorProps: {
        attributes: {
          class: tiptapClassName,
        },
      },
      editable,
      onTransaction: () => {
        onChange?.(createCommentEditor(instance));
      },
    });

    onChange?.(createCommentEditor(instance));

    return () => {
      instance.destroy();
    };
  }, [autofocus, placeholder]);

  if (!innerEditor) {
    return (
      <div aria-disabled className={editorClassName}>
        <div className={cn("tiptap", tiptapClassName)}>
          <p className="is-editor-empty" data-placeholder={placeholder} />
        </div>
      </div>
    );
  }

  if (!editable) {
    return <EditorContent editor={innerEditor} />;
  }

  innerEditor.setEditable(!disabled);

  return (
    // @sonar-ignore
    // biome-ignore lint/a11y/useSemanticElements: tiptap editor
    <div
      aria-disabled={disabled}
      aria-multiline="true"
      className={editorClassName}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          innerEditor?.commands.focus();
        }
      }}
      onMouseUp={() => {
        innerEditor?.commands.focus();
      }}
      role="textbox"
      tabIndex={disabled ? -1 : 0}
    >
      <EditorContent editor={innerEditor} />
      <EditorToolbar editor={innerEditor} />
    </div>
    // @end
  );
}
