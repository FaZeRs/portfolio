import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { PluggableList } from "unified";
import { visit } from "unist-util-visit";

import { remarkHeading } from "~/lib/mdx-plugins/remark/remark-heading";

const eventRegex = /event="([^"]*)"/;
export const remarkPlugins: PluggableList = [remarkGfm, remarkHeading];
export const rehypePlugins: PluggableList = [
  rehypeSlug,
  // biome-ignore lint/suspicious/noExplicitAny: any is used for markdown
  () => (tree: any) => {
    // biome-ignore lint/suspicious/noExplicitAny: any is used for markdown
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: valid visit
    visit(tree, (node: any) => {
      if (node?.type === "element" && node?.tagName === "pre") {
        const [codeEl] = node.children;

        if (codeEl.tagName !== "code") {
          return;
        }

        if (codeEl.data?.meta) {
          // Extract event from meta and pass it down the tree.
          const match = codeEl.data?.meta.match(eventRegex);
          if (match) {
            node.__event__ = match ? match[1] : null;
            codeEl.data.meta = codeEl.data.meta.replace(eventRegex, "");
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
      // biome-ignore lint/suspicious/noExplicitAny: any is used for markdown
      onVisitLine(node: any) {
        if (node.children.length === 0) {
          node.children = [{ type: "text", value: " " }];
        }
        node.properties.className = ["line"];
      },
      // biome-ignore lint/suspicious/noExplicitAny: any is used for markdown
      onVisitHighlightedLine(node: any) {
        node.properties.className.push("line--highlighted");
      },
      // biome-ignore lint/suspicious/noExplicitAny: any is used for markdown
      onVisitHighlightedWord(node: any) {
        node.properties.className = ["word--highlighted"];
      },
    },
  ],
  // biome-ignore lint/suspicious/noExplicitAny: any is used for markdown
  () => (tree: any) => {
    // biome-ignore lint/suspicious/noExplicitAny: any is used for markdown
    visit(tree, (node: any) => {
      if (node?.type === "element" && node.tagName === "figure") {
        const preElement = node.children.at(-1);

        if (preElement.tagName !== "pre") {
          return;
        }

        preElement.properties.__withMeta__ =
          node.children.at(0).tagName === "div";
        preElement.properties.__rawString__ = node.__rawString__;
      }
    });
  },
  rehypeRaw,
];
