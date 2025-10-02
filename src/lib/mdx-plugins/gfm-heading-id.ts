import { generateSlug, stripMarkdown } from "../utils";

export function gfmHeadingId() {
  return {
    headerIds: false,
    useNewRenderer: true,
    renderer: {
      // biome-ignore lint/suspicious/noExplicitAny: any is used to avoid type errors
      heading({ tokens, depth }: { tokens: any; depth: any }): string {
        const text = tokens
          // biome-ignore lint/suspicious/noExplicitAny: any is used to avoid type errors
          .map((token: any) => token.raw || token.text || "")
          .join("");
        const raw = stripMarkdown(text);
        const level = depth;
        const id = generateSlug(raw.toLowerCase());

        return `<h${level} id="${id}">${text}</h${level}>\n`;
      },
    },
  };
}
