import type { SimpleIcon } from "simple-icons";

const Icon = ({
  icon,
  className,
}: {
  icon: SimpleIcon;
  className?: string;
}) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    className={className}
  >
    <title>{icon.title}</title>
    <path d={icon.path} fill="currentColor" />
  </svg>
);

export default Icon;
