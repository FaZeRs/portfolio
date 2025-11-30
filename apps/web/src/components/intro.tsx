import { Button } from "@acme/ui/button";
import { motion } from "framer-motion";
import { Calendar, MessageSquare } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "~/lib/config/site";
import ContactModal from "./contact-modal";
import { LazyImage } from "./lazy-image";

const Intro = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <section className="flex min-h-[calc(100vh-80px)] scroll-mt-[100rem] flex-col justify-center space-y-4 text-center sm:mb-0">
      <div className="flex items-center justify-center">
        <div className="relative">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0 }}
            transition={{
              type: "tween",
              duration: 0.2,
            }}
          >
            <LazyImage
              alt="Nauris Linde"
              height={320}
              imageClassName="h-56 w-56 rounded-full border-[0.35rem] border-secondary object-cover shadow-xl saturate-0 filter sm:h-80 sm:w-80"
              priority={true}
              src="/images/avatar.avif"
              width={320}
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 mb-10 flex flex-col gap-y-4 px-4"
        initial={{ opacity: 0, y: 100 }}
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
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-3 px-4 font-medium text-lg sm:flex-row"
        initial={{ opacity: 0, y: 100 }}
        transition={{
          delay: 0.1,
        }}
      >
        <Button
          className="group min-w-[200px]"
          onClick={() => setIsContactModalOpen(true)}
          size="lg"
          variant="default"
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Contact me
        </Button>
        <Button
          asChild
          className="group min-w-[200px]"
          size="lg"
          variant="secondary"
        >
          <a
            href={siteConfig.calendlyUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Book a call
          </a>
        </Button>
      </motion.div>

      <ContactModal
        onOpenChange={setIsContactModalOpen}
        open={isContactModalOpen}
      />
    </section>
  );
};

export default Intro;
