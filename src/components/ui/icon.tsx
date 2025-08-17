import type { SimpleIcon } from "simple-icons";

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
