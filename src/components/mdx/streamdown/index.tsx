import { createContext, memo, Suspense, useId, useMemo } from "react";
import type { BundledTheme } from "shiki";
import { cn } from "~/lib/utils";
import CustomMDX from "../mdx";
import { parseMarkdownIntoBlocks } from "./parse-blocks";
import { parseIncompleteMarkdown } from "./parse-incomplete-markdown";

export type ControlsConfig =
  | boolean
  | {
      table?: boolean;
      code?: boolean;
    };

type HardenMarkdownProps = {
  defaultOrigin?: string;
  allowedLinkPrefixes?: string[];
  allowedImagePrefixes?: string[];
  children?: string | null;
};

export type StreamdownProps = HardenMarkdownProps & {
  parseIncompleteMarkdown?: boolean;
  className?: string;
  shikiTheme?: [BundledTheme, BundledTheme];
  controls?: ControlsConfig;
};

export const ShikiThemeContext = createContext<[BundledTheme, BundledTheme]>([
  "github-light" as BundledTheme,
  "github-dark" as BundledTheme,
]);

export const ControlsContext = createContext<ControlsConfig>(true);

type BlockProps = HardenMarkdownProps & {
  content: string;
  shouldParseIncompleteMarkdown: boolean;
};

const Block = memo(
  ({ content, shouldParseIncompleteMarkdown, ...props }: BlockProps) => {
    const parsedContent = useMemo(
      () =>
        typeof content === "string" && shouldParseIncompleteMarkdown
          ? parseIncompleteMarkdown(content.trim())
          : content,
      [content, shouldParseIncompleteMarkdown]
    );

    return (
      <Suspense>
        <CustomMDX {...props} source={parsedContent} />
      </Suspense>
    );
  },
  (prevProps, nextProps) => prevProps.content === nextProps.content
);

Block.displayName = "Block";

export const Streamdown = memo(
  ({
    children,
    parseIncompleteMarkdown: shouldParseIncompleteMarkdown = true,
    className,
    allowedImagePrefixes = ["*"],
    allowedLinkPrefixes = ["*"],
    defaultOrigin,
    shikiTheme = ["github-light", "github-dark"],
    controls = true,
    ...props
  }: StreamdownProps) => {
    // Parse the children to remove incomplete markdown tokens if enabled
    const generatedId = useId();
    const blocks = useMemo(
      () =>
        parseMarkdownIntoBlocks(typeof children === "string" ? children : ""),
      [children]
    );

    return (
      <ShikiThemeContext.Provider value={shikiTheme}>
        <ControlsContext.Provider value={controls}>
          <div className={cn("space-y-4", className)} {...props}>
            {blocks.map((block, index) => (
              <Block
                allowedImagePrefixes={allowedImagePrefixes}
                allowedLinkPrefixes={allowedLinkPrefixes}
                content={block}
                defaultOrigin={defaultOrigin}
                // biome-ignore lint/suspicious/noArrayIndexKey: "required"
                key={`${generatedId}-block_${index}`}
                shouldParseIncompleteMarkdown={shouldParseIncompleteMarkdown}
              />
            ))}
          </div>
        </ControlsContext.Provider>
      </ShikiThemeContext.Provider>
    );
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.shikiTheme === nextProps.shikiTheme
);
Streamdown.displayName = "Streamdown";
