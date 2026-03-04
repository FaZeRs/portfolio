import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTRPC } from "~/lib/trpc";
import ArticleCard from "./blog/article-card";

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

const RecentPosts = () => {
  const trpc = useTRPC();
  const { data: articles } = useSuspenseQuery(
    trpc.blog.allPublic.queryOptions()
  );

  const recentArticles = articles.slice(0, 3);

  if (recentArticles.length === 0) {
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
          From the Blog
        </motion.span>
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-3xl tracking-tight sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
        >
          Latest Writing
        </motion.h2>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 max-w-2xl text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.3 }}
        >
          Thoughts on tech, side projects, and things I find interesting.
        </motion.p>
      </div>

      <motion.div
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
        initial="hidden"
        variants={containerVariants}
        viewport={{ once: true }}
        whileInView="visible"
      >
        {recentArticles.map((article) => (
          <motion.div key={article.slug} variants={itemVariants}>
            <ArticleCard article={article} />
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
          to="/blog"
        >
          View all posts
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
};

export default RecentPosts;
