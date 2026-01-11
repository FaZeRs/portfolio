import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTRPC } from "~/lib/trpc";
import ProjectCard from "./projects/project-card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const FeaturedProjects = () => {
  const trpc = useTRPC();
  const { data: projects } = useSuspenseQuery(
    trpc.project.allPublic.queryOptions()
  );

  // Get only featured projects or first 4 if none are featured
  const featured = projects.filter((p) => p.isFeatured).slice(0, 4);
  const featuredProjects =
    featured.length > 0 ? featured : projects.slice(0, 4);

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col items-center px-1 text-center sm:mb-10">
        <motion.span
          animate={{ opacity: 1 }}
          className="mb-3 font-medium text-primary text-sm uppercase tracking-widest"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.1 }}
        >
          Portfolio
        </motion.span>
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-3xl tracking-tight sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
        >
          Recent Work
        </motion.h2>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 max-w-2xl text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.3 }}
        >
          A selection of projects I've worked on. Each one represents a unique
          challenge solved with modern technologies.
        </motion.p>
      </div>

      <motion.div
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6"
        initial="hidden"
        variants={containerVariants}
        viewport={{ once: true }}
        whileInView="visible"
      >
        {featuredProjects.map((project) => (
          <motion.div key={project.slug} variants={itemVariants}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "group"
          )}
          to="/projects"
        >
          View all projects
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
};

export default FeaturedProjects;
