import { FileIcon, TerminalIcon } from "lucide-react";
import { createElement } from "react";
import {
  siJavascript,
  siMarkdown,
  siMdx,
  siReact,
  siTypescript,
} from "simple-icons";
import SimpleIcon from "~/components/ui/icon";

type Icon = {
  language: string[];

  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const icons: Icon[] = [
  {
    language: ["javascript", "js", "mjs", "cjs"],
    icon: (props: React.SVGProps<SVGSVGElement>) =>
      createElement(SimpleIcon, { icon: siJavascript, ...props }),
  },
  {
    language: ["typescript", "ts", "mts", "cts"],
    icon: (props: React.SVGProps<SVGSVGElement>) =>
      createElement(SimpleIcon, { icon: siTypescript, ...props }),
  },
  {
    language: ["jsx", "tsx"],
    icon: (props: React.SVGProps<SVGSVGElement>) =>
      createElement(SimpleIcon, { icon: siReact, ...props }),
  },
  {
    language: ["sh", "bash", "zsh"],
    icon: TerminalIcon,
  },
  {
    language: ["markdown", "md"],
    icon: (props: React.SVGProps<SVGSVGElement>) =>
      createElement(SimpleIcon, { icon: siMarkdown, ...props }),
  },
  {
    language: ["mdx"],
    icon: (props: React.SVGProps<SVGSVGElement>) =>
      createElement(SimpleIcon, { icon: siMdx, ...props }),
  },
];

const languageToIcon = new Map<
  string,
  React.FC<React.SVGProps<SVGSVGElement>>
>();

for (const icon of icons) {
  for (const language of icon.language) {
    languageToIcon.set(language, icon.icon);
  }
}

export const getIconByLanguage = (
  language: string
): React.FC<React.SVGProps<SVGSVGElement>> => {
  return languageToIcon.get(language) ?? FileIcon;
};
