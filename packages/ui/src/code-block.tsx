import { cn } from "@acme/ui";
import { ComponentProps, useEffect, useRef, useState } from "react";
import CopyButton from "./copy-button";
import { getIconByLanguage } from "./icon";
import { ScrollArea, ScrollBar } from "./scroll-area";

type CodeBlockProps = {
  "data-lang"?: string;
  "data-language"?: string;
  figureClassName?: string;
} & ComponentProps<"pre">;

export default function CodeBlock({
  title,
  className,
  figureClassName,
  "data-lang": dataLang,
  "data-language": dataLanguage,
  ref,
  children,
  ...rest
}: Readonly<CodeBlockProps>) {
  const lang = dataLang || dataLanguage;
  const Icon = getIconByLanguage(lang ?? "");
  const textInput = useRef<HTMLPreElement>(null);
  const [copyText, setCopyText] = useState("");

  useEffect(() => {
    if (textInput.current) {
      const text = textInput.current.textContent || "";
      setCopyText(text);
    }
  }, []);

  return (
    <figure
      className={cn(
        "not-prose group relative my-6 overflow-hidden rounded-lg border bg-secondary/50 text-sm",
        figureClassName
      )}
    >
      {title ? (
        <div className="flex flex-row items-center gap-2 border-b bg-muted/50 px-4 py-1.5">
          <div className="text-muted-foreground">
            <Icon className="size-3.5" />
          </div>
          <figcaption className="flex-1 truncate text-muted-foreground">
            {title}
          </figcaption>
          <CopyButton className="-me-2" value={copyText} />
        </div>
      ) : (
        <CopyButton className="absolute top-2 right-2 z-10" value={copyText} />
      )}

      <ScrollArea>
        <pre
          className={cn("p-4 text-[13px]", className)}
          ref={textInput}
          {...rest}
        >
          {children}
        </pre>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </figure>
  );
}
