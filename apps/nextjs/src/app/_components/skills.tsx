"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";

import { skillsData } from "~/constants/skills-data";
import SectionHeading from "./section-heading";

const fadeInAnimationVariants: Variants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
    },
  }),
};

const SkillSection = () => {
  return (
    <div>
      <SectionHeading>My Skills</SectionHeading>
      <ul className="flex flex-wrap justify-center gap-2 text-lg text-gray-800">
        {skillsData.map((skill, index) => (
          <motion.li
            className="cursor-default rounded-xl border bg-white px-5 py-3 ease-in-out hover:border-zinc-700 dark:bg-white/10 dark:text-white/80"
            key={index}
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            custom={index}
          >
            {skill}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default SkillSection;
