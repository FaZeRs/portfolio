"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Zoom from "react-medium-image-zoom";

import "react-medium-image-zoom/dist/styles.css";

interface ImageZoomProps extends ComponentPropsWithoutRef<typeof Zoom> {
  children: ReactNode;
}

export default function ImageZoom({
  children,
  ...rest
}: Readonly<ImageZoomProps>) {
  return (
    <Zoom zoomMargin={40} {...rest}>
      {children}
    </Zoom>
  );
}
