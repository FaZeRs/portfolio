import { Bold } from "@tiptap/extension-bold";
import { Document } from "@tiptap/extension-document";
import { Italic } from "@tiptap/extension-italic";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Strike } from "@tiptap/extension-strike";
import { Text } from "@tiptap/extension-text";
import { Editor, EditorContent, type JSONContent } from "@tiptap/react";
import { useEffect, useState } from "react";

import { cn } from "~/lib/utils";
import EditorToolbar from "./editor-toolbar";

import "~/lib/styles/editor.css";

interface CommentEditorProps {
  editor: UseCommentEditor | null;
  placeholder?: string;
  autofocus?: boolean;
  editable?: boolean;
  disabled?: boolean;
  content?: JSONContent;
  onChange?: (editor: UseCommentEditor) => void;
}

interface UseCommentEditor {
  editor: Editor;
  isEmpty: boolean;
  getValue: () => JSONContent;
  clearValue: () => void;
}

export const useCommentEditor = (): [
  editor: UseCommentEditor | null,
  setEditor: (editor: UseCommentEditor) => void,
] => {
  return useState<UseCommentEditor | null>(null);
};

const createCommentEditor = (editor: Editor): UseCommentEditor => {
  return {
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
  };
};

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
    "aria-disabled:cursor-not-allowed aria-disabled:opacity-80",
  );

  const tiptapClassName = cn(
    "focus-visible:outline-none",
    editable && "min-h-10 px-3 py-2",
  );

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
  }, [
    autofocus,
    placeholder,
    content,
    editable,
    innerEditor,
    onChange,
    tiptapClassName,
  ]);

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
    <div
      // biome-ignore lint/a11y/useSemanticElements: tiptap editor
      role="textbox"
      aria-disabled={disabled}
      aria-multiline="true"
      tabIndex={disabled ? -1 : 0}
      className={editorClassName}
      onMouseUp={() => {
        innerEditor?.commands.focus();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          innerEditor?.commands.focus();
        }
      }}
    >
      <EditorContent editor={innerEditor} />
      <EditorToolbar editor={innerEditor} />
    </div>
    // @end
  );
}
