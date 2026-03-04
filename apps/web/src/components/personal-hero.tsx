import { siteConfig, socialConfig } from "@acme/config";
import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/button";
import Icon from "@acme/ui/icon";
import { LazyImage } from "@acme/ui/lazy-image";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const PersonalHero = () => (
  <section className="relative min-h-[calc(100vh-80px)]">
    {/* Background gradient */}
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 45% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 60% 40%, rgba(251, 191, 36, 0.06) 0%, transparent 60%)",
        }}
      />
    </div>

    <div className="container mx-auto flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-8 sm:py-16 lg:flex-row lg:gap-16">
      {/* Left side - Content */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="flex max-w-2xl flex-col gap-6 text-center lg:text-left"
        initial={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Interest badge */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center lg:justify-start"
          initial={{ opacity: 0, y: -10 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 font-medium text-amber-600 text-sm dark:text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            Currently into WebAssembly
          </span>
        </motion.div>

        {/* Greeting + Name */}
        <div>
          <p className="mb-2 text-lg text-muted-foreground">Hey, I'm</p>
          <h1 className="font-bold font-heading text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {siteConfig.author.name}
          </h1>
        </div>

        {/* Personal tagline */}
        <p className="text-lg text-muted-foreground leading-relaxed sm:text-xl">
          R&D Engineer by day, side-project tinkerer by night. I like building
          things with C++, React, and WebAssembly — and writing about whatever
          catches my attention.
        </p>

        {/* CTAs */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            className={cn(buttonVariants({ size: "lg" }), "group")}
            to="/blog"
          >
            Read the blog
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            className={buttonVariants({ size: "lg", variant: "outline" })}
            to="/projects"
          >
            See what I've built
          </Link>
        </motion.div>

        {/* Social links */}
        <motion.div
          animate={{ opacity: 1 }}
          className="flex justify-center gap-2 lg:justify-start"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.6 }}
        >
          {socialConfig.map((social) => (
            <a
              className="group rounded-lg border bg-card p-2.5 transition-all hover:border-foreground/20 hover:shadow-md"
              href={social.url}
              key={social.name}
              rel="noreferrer"
              target="_blank"
            >
              <Icon
                className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground"
                icon={social.icon}
              />
              <span className="sr-only">{social.name}</span>
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Right side - Avatar */}
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="relative hidden lg:block"
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Glow effect */}
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-amber-500/15 blur-2xl" />

        {/* Main image container */}
        <div className="relative rounded-3xl border border-black/10 bg-gradient-to-br from-white/10 to-white/5 p-2.5 shadow-2xl backdrop-blur-sm dark:border-white/10 dark:from-white/5 dark:to-white/[0.02]">
          <div className="overflow-hidden rounded-2xl">
            <LazyImage
              alt={siteConfig.author.name}
              height={400}
              imageClassName="h-64 w-64 object-cover transition-all duration-500 sm:h-72 sm:w-72 lg:h-80 lg:w-80"
              priority={true}
              src="/images/avatar.avif"
              width={400}
            />
          </div>

          {/* Name tag */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-background/80 px-4 py-1.5 shadow-lg backdrop-blur-md">
            <span className="font-semibold text-sm">
              {siteConfig.author.name}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PersonalHero;
