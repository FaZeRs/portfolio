import type { HTMLAttributes } from "react";

import { cn } from "~/lib/utils";

import CopyButton from "./copy-button";

type CodeBlockProps = HTMLAttributes<HTMLPreElement> & {
  title?: string;
  __rawString__?: string;
  __withMeta__?: boolean;
};

export default function CodeBlock({
  className,
  __rawString__,
  __withMeta__,
  ...props
}: Readonly<CodeBlockProps>) {
  return (
    <>
      <pre
        className={cn(
          "dark:!bg-[#0A0A0A] overflow-x-auto rounded-lg bg-white py-4",
          className,
        )}
        {...props}
      />
      {__rawString__ && (
        <CopyButton value={__rawString__} withMeta={__withMeta__} />
      )}
    </>
  );
}
