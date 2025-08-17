import type { Variants } from "framer-motion";
import { motion } from "framer-motion";

import { skillsData } from "~/lib/constants/skills-data";
import SectionHeading from "./section-heading";

const DELAY_FACTOR = 0.05;

const fadeInAnimationVariants: Variants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: DELAY_FACTOR * index,
    },
  }),
};

const SkillSection = () => {
  return (
    <div>
      <SectionHeading>My Skills</SectionHeading>
      <ul className="flex flex-wrap justify-center gap-2 text-gray-800 text-lg">
        {skillsData.map((skill, index) => (
          <motion.li
            className="cursor-default rounded-xl border bg-white px-5 py-3 ease-in-out hover:border-zinc-700 dark:bg-white/10 dark:text-white/80"
            custom={index}
            initial="initial"
            key={skill}
            variants={fadeInAnimationVariants}
            viewport={{
              once: true,
            }}
            whileInView="animate"
          >
            {skill}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default SkillSection;
