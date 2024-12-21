// TODO: Remove these eslint rules once we have a better solution
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import { visit } from "unist-util-visit";

import { components } from "./mdx-components";

import "~/styles/mdx.css";

export function CustomMDX(props: any) {
  const options = {
    mdxOptions: {
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
        remarkRehype,
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

              preElement.properties.__withMeta__ =
                node.children.at(0).tagName === "div";
              preElement.properties.__rawString__ = node.__rawString__;
            }
          });
        },
      ],
    },
  };
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={options}
    />
  );
}
