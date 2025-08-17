import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { SimpleIcon } from "simple-icons";

import AnimatedDiv from "~/components/animated-div";
import { fadeContainer, popUp } from "~/lib/constants/framer-motion-variants";
import { software } from "~/lib/constants/uses-data";

const createIconComponent =
  (icon: SimpleIcon) => (props: React.ComponentProps<"svg">) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24">
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  );

export default function Uses() {
  return (
    <div className="mt-10">
      <motion.h2 className="font-bold font-heading text-lg sm:text-2xl">
        Software and Applications
      </motion.h2>

      <AnimatedDiv
        className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-7"
        variants={fadeContainer}
      >
        {software.map((item) => {
          const Icon = createIconComponent(item.icon);

          return (
            <motion.div key={item.name} variants={popUp}>
              <Link
                className="active:!scale-90 lg:hover:!scale-125 relative flex flex-col items-center justify-center gap-2 rounded-md border border-transparent bg-background p-6 text-gray-700 shadow transition-all hover:z-10 hover:origin-center hover:border-gray-400 hover:text-black hover:shadow-lg dark:bg-secondary dark:text-gray-300/80 dark:shadow-md dark:hover:border-neutral-600 dark:hover:text-white"
                rel="noopener noreferrer"
                target="_blank"
                title={`${item.name} - ${item.description}`}
                to={item.link}
              >
                <Icon className="!pointer-events-none mb-4 h-8 w-8" />
                <p className="line-clamp-1 select-none text-xs">{item.name}</p>
              </Link>
            </motion.div>
          );
        })}
      </AnimatedDiv>
    </div>
  );
}
