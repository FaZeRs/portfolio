import { LazyImage } from "./lazy-image";
import ImageZoom from "./ui/image-zoom";

export default function ZoomImage(
  props: Readonly<React.ComponentPropsWithoutRef<typeof LazyImage>>
) {
  const { caption, alt, ...rest } = props;

  return (
    <>
      <ImageZoom>
        <LazyImage alt={alt} className="mt-6 rounded-lg border" {...rest} />
      </ImageZoom>
      {caption && <figcaption className="mt-4 text-center">{alt}</figcaption>}
    </>
  );
}
