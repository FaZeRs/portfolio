"use client";

import type { ComponentPropsWithoutRef, HTMLAttributes } from "react";
import { forwardRef, useState } from "react";
import Image from "next/image";

import { cn } from "@acme/ui";

type BlurImageProps = HTMLAttributes<HTMLDivElement> &
  ComponentPropsWithoutRef<typeof Image> & {
    caption?: string;
    lazy?: boolean;
  };

export const BlurImage = forwardRef<HTMLDivElement, BlurImageProps>(
  ({ src, alt, className, lazy = true, ...rest }, ref) => {
    const [isLoading, setLoading] = useState(true);

    return (
      <div
        className={cn(
          "overflow-hidden",
          isLoading && "animate-pulse",
          className,
        )}
        ref={ref}
      >
        <Image
          src={src}
          alt={alt}
          loading={lazy ? "lazy" : undefined}
          priority={!lazy}
          quality={100}
          onLoad={() => setLoading(false)}
          {...rest}
        />
      </div>
    );
  },
);

BlurImage.displayName = "Image";
