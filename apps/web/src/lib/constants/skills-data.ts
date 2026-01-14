import {
  siCplusplus,
  siCss3,
  siDocker,
  siGit,
  siHtml5,
  siJavascript,
  siLaravel,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siQt,
  siReact,
  siTailwindcss,
  siTypescript,
  siWebassembly,
} from "simple-icons";

export type Skill = {
  name: string;
  icon: typeof siReact;
};

export type SkillCategory = {
  name: string;
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    skills: [
      { name: "React", icon: siReact },
      { name: "TypeScript", icon: siTypescript },
      { name: "Next.js", icon: siNextdotjs },
      { name: "JavaScript", icon: siJavascript },
      { name: "Tailwind CSS", icon: siTailwindcss },
      { name: "HTML5", icon: siHtml5 },
      { name: "CSS3", icon: siCss3 },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "Node.js", icon: siNodedotjs },
      { name: "PHP", icon: siPhp },
      { name: "Laravel", icon: siLaravel },
      { name: "PostgreSQL", icon: siPostgresql },
    ],
  },
  {
    name: "Desktop & Systems",
    skills: [
      { name: "C++", icon: siCplusplus },
      { name: "Qt", icon: siQt },
      { name: "WebAssembly", icon: siWebassembly },
    ],
  },
  {
    name: "Tools & DevOps",
    skills: [
      { name: "Git", icon: siGit },
      { name: "Docker", icon: siDocker },
    ],
  },
];

// Flat array for backwards compatibility
export const skillsData = skillCategories.flatMap((category) =>
  category.skills.map((skill) => skill.name)
);
