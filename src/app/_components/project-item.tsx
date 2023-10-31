import Image from "next/image";
import type { RouterOutputs } from "~/trpc/shared";

type Project = RouterOutputs["project"]["list"][number];

interface ItemProps {
  item: Project;
}

const ProjectItem = ({ item }: ItemProps) => {
  const thumbnail =
    item.thumbnailUrl ??
    `https://placehold.co/1000x750.png?text=${item.title}&font=roboto`;
  return (
    <div className="mx-auto transform cursor-pointer transition-all hover:scale-105 md:mx-0">
      <Image
        src={thumbnail}
        className="aspect-video h-min w-full object-cover shadow"
        alt={item.title}
        width="1000"
        height="750"
      />
    </div>
  );
};

export default ProjectItem;
