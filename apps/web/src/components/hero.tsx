import { siteConfig } from "@acme/config";
import { Button } from "@acme/ui/button";
import { LazyImage } from "@acme/ui/lazy-image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { useState } from "react";
import ContactModal from "./contact-modal";

const Hero = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <section className="relative min-h-[calc(100vh-80px)]">
      {/* Background gradient - using radial gradients that naturally fade to transparent */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 45% 50%, rgba(139, 92, 246, 0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 35% 50%, rgba(217, 70, 239, 0.08) 0%, transparent 60%)",
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
          {/* Badge */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center lg:justify-start"
            initial={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 font-medium text-emerald-600 text-sm dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for new projects
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-bold text-3xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            I build{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent dark:from-violet-400 dark:via-fuchsia-400 dark:to-pink-400">
              high-performance
            </span>{" "}
            web applications
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-muted-foreground leading-relaxed sm:text-xl">
            Full-stack developer specializing in React, TypeScript, and modern
            web technologies. I help startups and businesses ship products that
            scale.
          </p>

          {/* Value props */}
          <div className="flex flex-wrap justify-center gap-4 text-muted-foreground text-sm lg:justify-start">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Fast delivery
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Clean code
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Reliable communication
            </span>
          </div>

          {/* CTAs */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              className="group w-full sm:w-auto"
              onClick={() => setIsContactModalOpen(true)}
              size="lg"
            >
              Start a project
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              asChild
              className="w-full sm:w-auto"
              size="lg"
              variant="outline"
            >
              <a
                href={siteConfig.calendlyUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book a free call
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Right side - Image with modern frame */}
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="relative hidden lg:block"
          initial={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Glow effect */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-500/20 blur-2xl" />

          {/* Main image container */}
          <div className="relative rounded-3xl border border-black/10 bg-gradient-to-br from-white/10 to-white/5 p-2.5 shadow-2xl backdrop-blur-sm dark:border-white/10 dark:from-white/5 dark:to-white/[0.02]">
            <div className="overflow-hidden rounded-2xl">
              <LazyImage
                alt="Nauris Linde"
                height={400}
                imageClassName="h-64 w-64 object-cover transition-all duration-500 sm:h-72 sm:w-72 lg:h-80 lg:w-80"
                priority={true}
                src="/images/avatar.avif"
                width={400}
              />
            </div>

            {/* Name tag */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-background/80 px-4 py-1.5 shadow-lg backdrop-blur-md">
              <span className="font-semibold text-sm">Nauris Linde</span>
            </div>
          </div>
        </motion.div>
      </div>

      <ContactModal
        onOpenChange={setIsContactModalOpen}
        open={isContactModalOpen}
      />
    </section>
  );
};

export default Hero;
