/* eslint-disable @typescript-eslint/no-explicit-any */
import { MarkdownHooks } from "react-markdown";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

import { components } from "./mdx-components";

import "~/lib/styles/mdx.css";

export function CustomMDX({ source }: Readonly<{ source: string }>) {
  const options = {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      () => (tree: any) => {
        visit(tree, (node: any) => {
          if (node?.type === "element" && node?.tagName === "pre") {
            const [codeEl] = node.children;

            if (codeEl.tagName !== "code") {
              return;
            }

            if (codeEl.data?.meta) {
              // Extract event from meta and pass it down the tree.
              const regex = /event="([^"]*)"/;
              const match = codeEl.data?.meta.match(regex);
              if (match) {
                node.__event__ = match ? match[1] : null;
                codeEl.data.meta = codeEl.data.meta.replace(regex, "");
              }
            }

            node.__rawString__ = codeEl.children?.[0].value;
          }
        });
      },
      [
        rehypePrettyCode,
        {
          theme: {
            light: "github-light",
            dark: "github-dark",
          },
          keepBackground: false,
          defaultLang: {
            block: "plaintext",
          },
          onVisitLine(node: any) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
            node.properties.className = ["line"];
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord(node: any) {
            node.properties.className = ["word--highlighted"];
          },
        },
      ],
      () => (tree: any) => {
        visit(tree, (node: any) => {
          if (node?.type === "element" && node.tagName === "figure") {
            const preElement = node.children.at(-1);

            if (preElement.tagName !== "pre") {
              return;
            }

            preElement.properties.__withMeta__ = node.children.at(0).tagName === "div";
            preElement.properties.__rawString__ = node.__rawString__;
          }
        });
      },
      rehypeRaw,
    ] as const,
  };
  return (
    <MarkdownHooks
      components={{ ...components }}
      remarkPlugins={options.remarkPlugins}
      // @ts-expect-error - Types are incorrect but the functionality works
      rehypePlugins={options.rehypePlugins}
    >
      {source}
    </MarkdownHooks>
  );
}
