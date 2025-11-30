import Icon from "@acme/ui/icon";
import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import CoverImage from "~/components/cover-image";
import { siteConfig, socialConfig } from "~/lib/config/site";
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
    <>
      <CoverImage alt="About" src="/images/about.avif" />
      <p className="prose prose-slate dark:prose-invert !max-w-none">
        Hello World! I'm <strong>Nauris Linde</strong>, a{" "}
        <strong>software engineer</strong> from Liepaja Latvia, with over a
        decade of programming experience. My journey began as a Backend Web
        Developer, where I specialized in Laravel framework while working at a
        digital agency, delivering multiple successful web projects.
      </p>
      <p className="prose prose-slate dark:prose-invert !max-w-none mt-4">
        Currently, I serve as a <strong>R&D Engineer</strong> overseeing the
        technical aspects of our Floorplan team. My work focuses on developing
        desktop applications using the Qt Framework for floor plan editing. I'm
        also deeply involved in writing C++ algorithms and implementing them in
        web applications through WebAssembly (WASM), bridging the gap between
        high-performance desktop software and modern web technologies.
      </p>
      <h2
        className="mt-10 scroll-m-28 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0"
        id="contact"
      >
        Contact
      </h2>
      <div className="mt-6 flex flex-col-reverse gap-12 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-3">
          <p>
            Please do not hesitate to contact me if you have any queries or are
            interested in working with me!
          </p>
          <span>{"There are several ways to contact it:"}</span>
          <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-gray-50 sm:text-base dark:border-gray-700 dark:hover:bg-gray-800"
              href={`mailto:${siteConfig.author.email}`}
              rel="noreferrer"
              target="_blank"
            >
              <Mail className="size-4 sm:size-5" size={16} />
              <span>Mail</span>
            </a>

            {socialConfig.map((social) => (
              <a
                className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-gray-50 sm:text-base dark:border-gray-700 dark:hover:bg-gray-800"
                href={social.url}
                key={social.name}
                rel="noreferrer"
                target="_blank"
              >
                <Icon className="size-4 sm:size-5" icon={social.icon} />
                <span>{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
