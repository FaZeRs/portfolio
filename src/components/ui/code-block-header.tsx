import { FileCode, FileText, FolderOpen, TerminalIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
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

import { cn } from "~/lib/utils";

import Icon from "./icon";

type CodeBlockProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  // biome-ignore lint: don't use literal key here
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
        return <Icon className="size-4" icon={siHtml5} />;
      case "css":
        return <Icon className="size-4" icon={siCss3} />;
      case "js":
        return <Icon className="size-4" icon={siJavascript} />;
      case "bash":
      case "sh":
      case "shell":
      case "zsh": {
        return <TerminalIcon className="size-4" />;
      }
      case "py":
        return <Icon className="size-4" icon={siPython} />;
      case "json":
        return <Icon className="size-4" icon={siJson} />;
      case "jsx":
        return <Icon className="size-4" icon={siReact} />;
      case "text":
        return <FileText className="size-4" />;
      case "md":
        return <Icon className="size-4" icon={siMarkdown} />;
      case "next":
        return <Icon className="size-4" icon={siNextdotjs} />;
      case "directory":
        return <FolderOpen className="size-4" />;
      case "vercel":
        return <Icon className="size-4" icon={siVercel} />;
      case "ts":
      case "tsx":
        return <Icon className="size-4" icon={siTypescript} />;
      default:
        return <FileCode className="size-4" />;
    }
  };

  return (
    <figcaption
      className={cn(
        "flex items-center gap-1.5 rounded-t-lg border-b bg-[#FAFAFA] px-4 py-2 text-sm dark:bg-background",
        className
      )}
      {...props}
    >
      {language && getLanguageIcon(language)}
      {children}
    </figcaption>
  );
}
