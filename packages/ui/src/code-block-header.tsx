"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { FileCode, FileText, FolderOpen, TerminalIcon } from "lucide-react";
import {
  siCss3,
  siHtml5,
  siJavascript,
  siJson,
  siMarkdown,
  siNextdotjs,
  siPython,
  siReact,
  siTypescript,
  siVercel,
} from "simple-icons";

import { cn } from "@acme/ui";

import Icon from "./icon";

type CodeBlockProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  ["data-language"]?: string;
};

export default function CodeBlockHeader({
  className,
  children,
  ...props
}: Readonly<CodeBlockProps>) {
  const language = props["data-language"];

  const getLanguageIcon = (lang: string): ReactNode => {
    switch (lang) {
      case "html":
        return <Icon icon={siHtml5} className="size-4" />;
      case "css":
        return <Icon icon={siCss3} className="size-4" />;
      case "js":
        return <Icon icon={siJavascript} className="size-4" />;
      case "bash":
      case "sh":
      case "shell":
      case "zsh": {
        return <TerminalIcon className="size-4" />;
      }
      case "py":
        return <Icon icon={siPython} className="size-4" />;
      case "json":
        return <Icon icon={siJson} className="size-4" />;
      case "jsx":
        return <Icon icon={siReact} className="size-4" />;
      case "text":
        return <FileText className="size-4" />;
      case "md":
        return <Icon icon={siMarkdown} className="size-4" />;
      case "next":
        return <Icon icon={siNextdotjs} className="size-4" />;
      case "directory":
        return <FolderOpen className="size-4" />;
      case "vercel":
        return <Icon icon={siVercel} className="size-4" />;
      case "ts":
      case "tsx":
        return <Icon icon={siTypescript} className="size-4" />;
      default:
        return <FileCode className="size-4" />;
    }
  };

  return (
    <figcaption
      className={cn(
        "flex items-center gap-1.5 rounded-t-lg border-b bg-[#FAFAFA] px-4 py-2 text-sm dark:bg-background",
        className,
      )}
      {...props}
    >
      {language && getLanguageIcon(language)}
      {children}
    </figcaption>
  );
}
