import type { HTMLAttributes } from "react";
import { useState } from "react";

import { cn } from "~/lib/utils";

type BlurImageProps = HTMLAttributes<HTMLDivElement> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  lazy?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

export function BlurImage({
  src,
  alt,
  className,
  lazy = true,
  ref,
  ...rest
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={cn("overflow-hidden", isLoading && "animate-pulse", className)}
      ref={ref}
    >
      <img
        src={src}
        alt={alt}
        loading={lazy ? "lazy" : undefined}
        onLoad={() => setIsLoading(false)}
        {...rest}
      />
    </div>
  );
}

BlurImage.displayName = "Image";
