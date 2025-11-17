import parse, {
  attributesToProps,
  DOMNode,
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";
import { Marked } from "marked";
import { cache, createElement, use, useMemo } from "react";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { gfmHeadingId } from "~/lib/mdx-plugins/gfm-heading-id";
import markedShiki from "~/lib/mdx-plugins/shiki";
import { cn } from "~/lib/utils";
import { components } from "./mdx-components";

const highlighterPromise = createHighlighterCore({
  themes: [import("@shikijs/themes/github-dark")],
  langs: [
    import("@shikijs/langs/typescript"),
    import("@shikijs/langs/javascript"),
    import("@shikijs/langs/markdown"),
    import("@shikijs/langs/bash"),
    import("@shikijs/langs/shell"),
    import("@shikijs/langs/python"),
    import("@shikijs/langs/json"),
    import("@shikijs/langs/html"),
    import("@shikijs/langs/css"),
    import("@shikijs/langs/cpp"),
  ],
  engine: createJavaScriptRegexEngine(),
});

const highlightCode = cache(
  async (code: string, lang: string, props: string[]) => {
    const highlighter = await highlighterPromise;

    return highlighter.codeToHtml(code, {
      lang,
      theme: "github-dark",
      meta: { __raw: props.join(" ") }, // required by `transformerMeta*`
    });
  }
);

const marked = new Marked().use(
  markedShiki({
    highlight(code, lang, props) {
      return highlightCode(code, lang, props);
    },
  })
);

marked.use(gfmHeadingId());

marked.setOptions({
  gfm: true,
  breaks: true,
  pedantic: false,
});

const voidElements = new Set(["hr", "br", "img", "input", "meta", "link"]);

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      const replacer = components[domNode.name];
      if (replacer) {
        // For void elements, don't pass children
        if (voidElements.has(domNode.name)) {
          return createElement(replacer, attributesToProps(domNode.attribs));
        }

        // For other elements, pass children
        return createElement(
          replacer,
          attributesToProps(domNode.attribs),
          domToReact(domNode.children as DOMNode[], options)
        );
      }
    }
  },
};

export default function CustomMDX({
  source,
  className,
}: Readonly<{ source: string; className?: string }>) {
  const contentPromise = useMemo(async () => {
    try {
      const markup = await marked.parse(source);
      return parse(markup, options);
    } catch (error) {
      console.error("Markdown parsing error:", error);
      return <p>Error parsing markdown content</p>;
    }
  }, [source]);

  const content = use(contentPromise);

  return <div className={cn("mdx-content", className)}>{content}</div>;
}
