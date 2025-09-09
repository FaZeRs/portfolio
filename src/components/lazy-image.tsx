import type { HTMLAttributes } from "react";
import { useCallback, useState } from "react";
import { useInView } from "react-intersection-observer";

import { cn } from "~/lib/utils";

type LazyImageProps = HTMLAttributes<HTMLDivElement> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  fallbackSrc?: string;
  quality?: number;
  sizes?: string;
  priority?: boolean;
  rootMargin?: string;
  threshold?: number;
  placeholder?: string;
  imageClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
};

export function LazyImage({
  src,
  alt,
  className,
  imageClassName,
  width = 100,
  height = 100,
  fallbackSrc = "/images/fallback.webp",
  quality = 90,
  sizes,
  priority = false,
  rootMargin = "50px",
  threshold = 0.1,
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E",
  onLoad,
  onError,
  ...rest
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);
  const { ref: imgRef, inView: isInView } = useInView({
    threshold,
    initialInView: priority,
    fallbackInView: true,
    onChange: (inView) => {
      if (inView) {
        setCurrentSrc(src);
      }
    },
  });
  const [currentSrc, setCurrentSrc] = useState(priority ? src : placeholder);

  const SCALE_HALF = 0.5;
  const SCALE_HIGH = 1.5;
  const SCALE_RETINA = 2;

  const loadingStrategy = (() => {
    if (priority) {
      return "eager";
    }
    if (isInView) {
      return "lazy";
    }
  })();

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
    onError?.();
  }, [currentSrc, fallbackSrc, onError]);

  const generateSrcSet = useCallback(
    (baseSrc: string) => {
      if (!baseSrc || hasError || baseSrc === placeholder) {
        return;
      }

      const srcSets = [
        `${baseSrc}?w=${Math.round(width * SCALE_HALF)}&q=${quality} 0.5x`,
        `${baseSrc}?w=${width}&q=${quality} 1x`,
        `${baseSrc}?w=${Math.round(width * SCALE_HIGH)}&q=${quality} 1.5x`,
        `${baseSrc}?w=${Math.round(width * SCALE_RETINA)}&q=${quality} 2x`,
      ];

      return srcSets.join(", ");
    },
    [width, quality, hasError, placeholder]
  );

  return (
    <div
      className={cn(
        "relative",
        isLoading && isInView && "animate-pulse",
        className
      )}
      ref={imgRef}
      style={{
        aspectRatio: `${width} / ${height}`,
      }}
      {...rest}
    >
      {hasError ? (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
          <span className="text-sm">Failed to load image</span>
        </div>
      ) : (
        <>
          {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: Image load/error handlers are necessary for functionality */}
          <img
            alt={alt}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-500",
              isLoading || !isInView ? "opacity-0" : "opacity-100",
              imageClassName
            )}
            fetchPriority={priority ? "high" : "auto"}
            height={height}
            loading={loadingStrategy}
            onError={handleError}
            onLoad={handleLoad}
            sizes={sizes}
            src={currentSrc}
            srcSet={generateSrcSet(currentSrc)}
            width={width}
          />

          {/* Loading spinner */}
          {isLoading && isInView && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

LazyImage.displayName = "LazyImage";
