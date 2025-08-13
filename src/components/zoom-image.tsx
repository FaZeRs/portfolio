import { BlurImage } from "./blur-image";
import ImageZoom from "./ui/image-zoom";

export default function ZoomImage(
  props: React.ComponentPropsWithoutRef<typeof BlurImage>,
) {
  const { caption, alt, ...rest } = props;

  return (
    <>
      <ImageZoom>
        <BlurImage className="mt-6 rounded-lg border" alt={alt} {...rest} />
      </ImageZoom>
      {caption && <figcaption className="mt-4 text-center">{alt}</figcaption>}
    </>
  );
}
