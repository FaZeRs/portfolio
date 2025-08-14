import { type AnchorHTMLAttributes, type HTMLAttributes, lazy } from "react";

import CodeBlock from "~/components/ui/code-block";
import CodeBlockHeader from "~/components/ui/code-block-header";
import { File, Files, Folder } from "~/components/ui/files";
import { cn } from "~/lib/utils";

export const components = {
  h1: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    // @sonar-ignore
    <h1
      className={cn(
        "mt-2 scroll-m-20 font-bold text-4xl tracking-tight",
        className,
      )}
      {...props}
    />
    // @end
  ),
  h2: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    // @sonar-ignore
    <h2
      className={cn(
        "mt-10 scroll-m-28 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
    // @end
  ),
  h3: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    // @sonar-ignore
    <h3
      className={cn(
        "mt-8 scroll-m-28 font-semibold text-2xl tracking-tight",
        className,
      )}
      {...props}
    />
    // @end
  ),
  h4: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    // @sonar-ignore
    <h4
      className={cn(
        "mt-8 scroll-m-28 font-semibold text-xl tracking-tight",
        className,
      )}
      {...props}
    />
    // @end
  ),
  h5: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    // @sonar-ignore
    <h5
      className={cn(
        "mt-8 scroll-m-20 font-semibold text-lg tracking-tight",
        className,
      )}
      {...props}
    />
    // @end
  ),
  h6: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    // @sonar-ignore
    <h6
      className={cn(
        "mt-8 scroll-m-20 font-semibold text-base tracking-tight",
        className,
      )}
      {...props}
    />
    // @end
  ),
  a: ({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    // @sonar-ignore
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      {...props}
    />
    // @end
  ),
  p: ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("leading-8 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn(
        "my-6 border-l-4 pl-6 italic [&>*]:text-gray-800 dark:[&>*]:text-gray-300",
        className,
      )}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className={cn("rounded-md border", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} /> {/* NOSONAR */}
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("m-0 border-t p-0 even:bg-muted", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  pre: CodeBlock,
  figcaption: CodeBlockHeader,
  code: ({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof CodeBlockHeader>) => (
    <code
      className={cn(
        "relative rounded border bg-muted px-[0.3rem] py-0.5 font-mono text-[0.95em]",
        className,
      )}
      {...props}
    />
  ),
  Steps: ({ ...props }) => (
    <div
      className="[&>h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]"
      {...props}
    />
  ),
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    // @sonar-ignore
    <h3
      className={cn(
        "mt-8 scroll-m-20 font-semibold text-lg tracking-tight",
        className,
      )}
      {...props}
    />
    // @end
  ),
  Image: lazy(() => import("~/components/zoom-image")),
  Callout: lazy(() => import("~/components/ui/callout")),
  GridContainer: lazy(() => import("~/components/ui/grid-container")),
  LoadingSkeleton: lazy(() => import("~/components/ui/loading-skeleton")),
  ComponentPreview: lazy(() => import("~/components/ui/component-preview")),
  FolderTree: lazy(() => import("~/components/ui/folder-tree")),
  CodePlayground: lazy(() => import("~/components/ui/code-playground")),
  Youtube: lazy(() => import("~/components/ui/youtube")),
  files: Files,
  folder: Folder,
  file: File,
};
