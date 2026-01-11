import { siteConfig, socialConfig } from "@acme/config";
import Icon from "@acme/ui/icon";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Mail, Sparkles } from "lucide-react";
import CoverImage from "~/components/cover-image";
import { seo } from "~/lib/seo";
import { getBaseUrl } from "~/lib/utils";

export const Route = createFileRoute("/(public)/about")({
  component: RouteComponent,
  head: () => {
    const seoData = seo({
      title: `About | ${siteConfig.title}`,
      description: "About me and my journey.",
      keywords: siteConfig.keywords,
      url: `${getBaseUrl()}/about`,
      canonical: `${getBaseUrl()}/about`,
    });
    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
});

function RouteComponent() {
  return (
    <div className="space-y-12">
      <CoverImage alt="About" src="/images/about.avif" />

      {/* Story section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-semibold text-xl">My Story</h2>
        </div>

        <div className="space-y-4 text-muted-foreground leading-relaxed">
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
        </div>
      </motion.div>

      {/* Skills highlights */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Code2 className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-semibold text-xl">What I Do</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
              className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:border-foreground/20 hover:shadow-md"
              key={item.title}
            >
              <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-semibold text-xl">Get In Touch</h2>
        </div>

        <p className="text-muted-foreground">
          Have a project in mind or just want to say hello? Feel free to reach
          out!
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 font-medium transition-all hover:border-foreground/20 hover:shadow-md"
            href={`mailto:${siteConfig.author.email}`}
            rel="noreferrer"
            target="_blank"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </a>

          {socialConfig.map((social) => (
            <a
              className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 font-medium transition-all hover:border-foreground/20 hover:shadow-md"
              href={social.url}
              key={social.name}
              rel="noreferrer"
              target="_blank"
            >
              <Icon className="h-4 w-4" icon={social.icon} />
              <span>{social.name}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
