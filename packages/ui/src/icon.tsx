import { FileIcon, TerminalIcon } from "lucide-react";
import { createElement } from "react";
import {
  type SimpleIcon,
  siJavascript,
  siMarkdown,
  siMdx,
  siReact,
  siTypescript,
} from "simple-icons";

interface IconType {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  language: string[];
}

const Icon = ({
  icon,
  className,
}: {
  icon: SimpleIcon;
  className?: string;
}) => (
  <svg
    className={className}
    height="24"
    role="img"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{icon.title}</title>
    <path d={icon.path} fill="currentColor" />
  </svg>
);

export default Icon;

const icons: IconType[] = [
  {
    language: ["javascript", "js", "mjs", "cjs"],
    icon: (props: React.SVGProps<SVGSVGElement>) =>
      createElement(Icon, { icon: siJavascript, ...props }),
  },
  {
    language: ["typescript", "ts", "mts", "cts"],
    icon: (props: React.SVGProps<SVGSVGElement>) =>
      createElement(Icon, { icon: siTypescript, ...props }),
  },
  {
    language: ["jsx", "tsx"],
    icon: (props: React.SVGProps<SVGSVGElement>) =>
      createElement(Icon, { icon: siReact, ...props }),
  },
  {
    language: ["sh", "bash", "zsh"],
    icon: TerminalIcon,
  },
  {
    language: ["markdown", "md"],
    icon: (props: React.SVGProps<SVGSVGElement>) =>
      createElement(Icon, { icon: siMarkdown, ...props }),
  },
  {
    language: ["mdx"],
    icon: (props: React.SVGProps<SVGSVGElement>) =>
      createElement(Icon, { icon: siMdx, ...props }),
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
): React.FC<React.SVGProps<SVGSVGElement>> =>
  languageToIcon.get(language) ?? FileIcon;
