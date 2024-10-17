import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { components } from "./mdx-components";

interface ReactMarkdownComponentProps {
  children?: string;
}

export default function ReactMarkdownComponent({
  children,
}: Readonly<ReactMarkdownComponentProps>) {
  return (
    <Markdown components={components} remarkPlugins={[remarkGfm]}>
      {children}
    </Markdown>
  );
}
