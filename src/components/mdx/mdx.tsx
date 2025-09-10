import { MarkdownHooks } from "react-markdown";
import { rehypePlugins, remarkPlugins } from "~/lib/mdx-plugins";
import { components } from "./mdx-components";

import "~/lib/styles/mdx.css";

export default function CustomMDX({ source }: Readonly<{ source: string }>) {
  const options = {
    remarkPlugins: [...remarkPlugins],
    rehypePlugins: [...rehypePlugins],
  };
  return (
    <MarkdownHooks
      components={{ ...components }}
      // biome-ignore lint/suspicious/noExplicitAny: valid any
      rehypePlugins={options.rehypePlugins as any}
      remarkPlugins={options.remarkPlugins}
    >
      {source}
    </MarkdownHooks>
  );
}
