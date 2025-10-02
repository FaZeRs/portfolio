import { Token, Tokens } from "marked";
import { generateSlug, stripMarkdown } from "../utils";

export function gfmHeadingId() {
  return {
    headerIds: false,
    useNewRenderer: true,
    renderer: {
      heading(
        // biome-ignore lint/suspicious/noExplicitAny: any is used to avoid type errors
        this: any,
        { tokens, depth }: { tokens: Token[]; depth: number }
      ): string {
        // Preserve inline formatting inside headings by rendering the inline tokens
        // with the built-in parser, while generating a stable slug from raw text.
        const rawText = (tokens as Tokens.Heading[])
          .map((token: Tokens.Heading) => token.raw || token.text || "")
          .join("");

        const id = generateSlug(stripMarkdown(rawText).toLowerCase());
        const innerHtml = this.parser.parseInline(tokens);
        const level = depth;

        return `<h${level} id="${id}">${innerHtml}</h${level}>\n`;
      },
    },
  };
}
