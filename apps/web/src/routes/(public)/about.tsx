import { siteConfig, socialConfig } from "@acme/config";
import Icon from "@acme/ui/icon";
import { LazyImage } from "@acme/ui/lazy-image";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Code2,
  GraduationCap,
  Mail,
  MapPin,
  Sparkles,
  Wrench,
} from "lucide-react";
import ExperienceSection from "~/components/experiences/experience";
import { skillCategories } from "~/lib/constants/skills-data";
import { seo } from "~/lib/seo";
import {
  generateStructuredDataGraph,
  getAboutPageSchemas,
} from "~/lib/structured-data";
import { getBaseUrl } from "~/lib/utils";

export const Route = createFileRoute("/(public)/about")({
  component: RouteComponent,
  head: () => {
    const seoData = seo({
      title: `About | ${siteConfig.title}`,
      description:
        "Full-Stack Developer with 10+ years of experience building scalable web applications, custom business software, and high-performance digital solutions. Hire a developer who delivers results.",
      keywords:
        "Full-Stack Developer, Senior Web Developer, Hire Developer, Custom Software Development, Web Application Expert, React TypeScript Developer, Business Software Engineer",
      url: `${getBaseUrl()}/about`,
      canonical: `${getBaseUrl()}/about`,
    });
    const structuredData = generateStructuredDataGraph(getAboutPageSchemas());

    return {
      meta: seoData.meta,
      links: seoData.links,
      scripts: [
        {
          type: "application/ld+json",
          children: structuredData,
        },
      ],
    };
  },
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const categoryIcons = {
  Frontend: Code2,
  Backend: Briefcase,
  "Desktop & Systems": Wrench,
  "Tools & DevOps": GraduationCap,
} as const;

function RouteComponent() {
  return (
    <div className="space-y-16">
      {/* Hero section */}
      <motion.section
        animate="visible"
        className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.div className="relative shrink-0" variants={itemVariants}>
          {/* Glow effect */}
          <div className="-inset-4 absolute rounded-3xl bg-linear-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-500/20 blur-2xl" />

          {/* Main image container */}
          <div className="relative rounded-3xl border border-black/10 bg-linear-to-br from-white/10 to-white/5 p-2 shadow-2xl backdrop-blur-sm dark:border-white/10 dark:from-white/5 dark:to-white/[0.02]">
            <div className="overflow-hidden rounded-2xl">
              <LazyImage
                alt="Avatar"
                height={160}
                imageClassName="size-32 sm:size-40 object-cover"
                src="/images/avatar.avif"
                width={160}
              />
            </div>
          </div>
        </motion.div>

        <motion.div className="space-y-3" variants={itemVariants}>
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <h1 className="font-bold text-3xl sm:text-4xl">Nauris Linde</h1>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-muted-foreground sm:justify-start">
            <span className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-1.5 text-sm">
              <Briefcase className="h-4 w-4" />
              R&D Engineer
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-1.5 text-sm">
              <MapPin className="h-4 w-4" />
              Liepaja, Latvia
            </span>
          </div>
        </motion.div>
      </motion.section>

      {/* Story section */}
      <motion.section
        animate="visible"
        className="space-y-6"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.div className="flex items-center gap-3" variants={itemVariants}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500/20 to-fuchsia-500/20">
            <Sparkles className="h-5 w-5 text-violet-500" />
          </div>
          <h2 className="font-bold text-2xl">My Story</h2>
        </motion.div>

        <motion.div
          className="space-y-4 text-muted-foreground leading-relaxed"
          variants={itemVariants}
        >
          <p>
            Hello World! I'm{" "}
            <strong className="text-foreground">Nauris Linde</strong>, a{" "}
            <strong className="text-foreground">software engineer</strong> from
            Liepaja, Latvia, with over a decade of programming experience. My
            journey began as a Backend Web Developer, where I specialized in
            Laravel framework while working at a digital agency, delivering
            multiple successful web projects.
          </p>
          <p>
            Currently, I serve as a{" "}
            <strong className="text-foreground">R&D Engineer</strong> overseeing
            the technical aspects of our Floorplan team. My work focuses on
            developing desktop applications using the Qt Framework for floor
            plan editing. I'm also deeply involved in writing C++ algorithms and
            implementing them in web applications through WebAssembly (WASM),
            bridging the gap between high-performance desktop software and
            modern web technologies.
          </p>
        </motion.div>
      </motion.section>

      {/* Experience section */}
      <motion.section
        animate="visible"
        className="space-y-8"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.div className="flex items-center gap-3" variants={itemVariants}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500/20 to-teal-500/20">
            <Briefcase className="h-5 w-5 text-emerald-500" />
          </div>
          <h2 className="font-bold text-2xl">Experience</h2>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ExperienceSection />
        </motion.div>
      </motion.section>

      {/* Skills section */}
      <motion.section
        animate="visible"
        className="space-y-8"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.div className="flex items-center gap-3" variants={itemVariants}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-500/20 to-orange-500/20">
            <Code2 className="h-5 w-5 text-amber-500" />
          </div>
          <h2 className="font-bold text-2xl">Skills & Technologies</h2>
        </motion.div>

        <motion.div className="space-y-6" variants={itemVariants}>
          {skillCategories.map((category) => {
            const CategoryIcon =
              categoryIcons[category.name as keyof typeof categoryIcons] ||
              Code2;
            return (
              <div key={category.name}>
                <div className="mb-4 flex items-center gap-2">
                  <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wider">
                    {category.name}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill) => (
                    <div
                      className="group flex items-center gap-2.5 rounded-xl border bg-card px-4 py-2.5 transition-all hover:border-foreground/20 hover:shadow-md"
                      key={skill.name}
                    >
                      <Icon
                        className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground"
                        icon={skill.icon}
                      />
                      <span className="font-medium text-sm">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* What I Do section */}
      <motion.section
        animate="visible"
        className="space-y-6"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.div className="flex items-center gap-3" variants={itemVariants}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500/20 to-blue-500/20">
            <Wrench className="h-5 w-5 text-cyan-500" />
          </div>
          <h2 className="font-bold text-2xl">What I Do</h2>
        </motion.div>

        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          variants={itemVariants}
        >
          {[
            {
              title: "Full-Stack Development",
              desc: "React, TypeScript, Node.js",
            },
            { title: "Desktop Applications", desc: "Qt Framework, C++" },
            {
              title: "Performance Engineering",
              desc: "WebAssembly, Optimization",
            },
            { title: "Open Source", desc: "Contributing & Maintaining" },
          ].map((item) => (
            <div
              className="group relative overflow-hidden rounded-xl border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-lg"
              key={item.title}
            >
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-pink-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-start gap-3">
                <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* Contact section */}
      <motion.section
        animate="visible"
        className="space-y-6"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.div className="flex items-center gap-3" variants={itemVariants}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-pink-500/20 to-rose-500/20">
            <Mail className="h-5 w-5 text-pink-500" />
          </div>
          <h2 className="font-bold text-2xl">Get In Touch</h2>
        </motion.div>

        <motion.p className="text-muted-foreground" variants={itemVariants}>
          Have a project in mind or just want to say hello? Feel free to reach
          out!
        </motion.p>

        <motion.div className="flex flex-wrap gap-3" variants={itemVariants}>
          <a
            className="group flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 font-medium transition-all hover:border-foreground/20 hover:shadow-md"
            href={`mailto:${siteConfig.author.email}`}
            rel="noreferrer"
            target="_blank"
          >
            <Mail className="h-4 w-4 transition-colors group-hover:text-primary" />
            <span>Email</span>
          </a>

          {socialConfig.map((social) => (
            <a
              className="group flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 font-medium transition-all hover:border-foreground/20 hover:shadow-md"
              href={social.url}
              key={social.name}
              rel="noreferrer"
              target="_blank"
            >
              <Icon
                className="h-4 w-4 transition-colors group-hover:text-primary"
                icon={social.icon}
              />
              <span>{social.name}</span>
            </a>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
}
