import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const Intro = () => {
  return (
    <section className="-mt-10 flex min-h-[calc(100vh-80px)] scroll-mt-[100rem] flex-col justify-center space-y-4 text-center sm:mb-0">
      <div className="flex items-center justify-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "tween",
              duration: 0.2,
            }}
          >
            <img
              src="/images/avatar.avif"
              alt="Nauris Linde"
              width="320"
              height="320"
              className="h-56 w-56 rounded-full border-[0.35rem] border-secondary object-cover shadow-xl saturate-0 filter sm:h-80 sm:w-80"
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        className="mt-4 mb-10 flex flex-col gap-y-4 px-4"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="font-bold text-2xl leading-[1.5] sm:text-4xl lg:text-6xl">
          {"Hello World, I'm Nauris"}
        </span>
        <span className="font-semibold text-muted-foreground text-xl">
          Software engineer & open-source maintainer
        </span>
        <span className="text-muted-foreground">
          I enjoy building sites & apps. My focus is C++.
        </span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center justify-center gap-2 px-4 font-medium text-lg sm:flex-row"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
        }}
      >
        <Link
          to="/"
          params={{
            section: "contact",
          }}
          className={cn(buttonVariants({ variant: "default" }), "group")}
        >
          Contact me
          <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
};

export default Intro;
