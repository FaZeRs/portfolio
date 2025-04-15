import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import CoverImage from "~/lib/components/cover-image";
import Icon from "~/lib/components/ui/icon";
import { siteConfig, socialConfig } from "~/lib/config/site";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <CoverImage src="/images/about.avif" alt="About" />
      <p className="prose prose-slate">
        Hello World! I'm <strong>Nauris Linde</strong>, a{" "}
        <strong>software engineer</strong> from Liepaja Latvia, with over a decade of
        programming experience. My journey began as a Backend Web Developer, where I
        specialized in Laravel framework while working at a digital agency, delivering
        multiple successful web projects.
      </p>
      <p className="prose prose-slate mt-4">
        Currently, I serve as a <strong>Tech Lead</strong> overseeing the technical
        aspects of our Floorplan team. My work focuses on developing desktop applications
        using the Qt Framework for floor plan editing. I'm also deeply involved in writing
        C++ algorithms and implementing them in web applications through WebAssembly
        (WASM), bridging the gap between high-performance desktop software and modern web
        technologies.
      </p>
      <h2
        className="mt-10 scroll-m-28 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0"
        id="contact"
      >
        Contact
      </h2>
      <div className="mt-6 flex flex-col-reverse gap-12 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-3">
          <p>
            {`Please do not hesitate to contact me if you have any queries or are interested in working with me!`}
          </p>
          <span>{"There are several ways to contact it:"}</span>
          <div className="mt-3 flex items-center gap-4">
            <a
              className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700"
              target="_blank"
              href={`mailto:${siteConfig.author.email}`}
            >
              <Mail size={18} />
              <span>Mail</span>
            </a>

            {socialConfig.map((social) => (
              <a
                key={social.name}
                className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700"
                target="_blank"
                href={social.url}
              >
                <Icon icon={social.icon} className="size-5" />
                <span>{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
