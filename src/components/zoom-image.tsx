import { BlurImage } from "./blur-image";
import ImageZoom from "./ui/image-zoom";

export default function ZoomImage(
  props: Readonly<React.ComponentPropsWithoutRef<typeof BlurImage>>
) {
  const { caption, alt, ...rest } = props;

  return (
    <>
      <ImageZoom>
        <BlurImage alt={alt} className="mt-6 rounded-lg border" {...rest} />
      </ImageZoom>
      {caption && <figcaption className="mt-4 text-center">{alt}</figcaption>}
    </>
  );
}
