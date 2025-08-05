import Slugger from "github-slugger";
import type { Heading } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { TOC } from "~/types";

declare module "mdast" {
  interface Data {
    hProperties?: { id?: string };
  }
}

export const remarkHeading: Plugin = () => {
  return (tree, file) => {
    const slugger = new Slugger();
    const toc: TOC[] = [];

    visit(tree, "heading", (node: Heading) => {
      node.data ??= { hProperties: {} };
      node.data.hProperties ??= {};

      const childNode = node.children[0];

      if (childNode?.type !== "text") return;

      const text = childNode.value;
      const id = slugger.slug(childNode.value);

      node.data.hProperties.id = id;

      toc.push({
        title: text,
        url: id,
        depth: node.depth,
      });

      return "skip";
    });

    file.data.toc = toc;
  };
};
