import type { Metadata } from "next";
import { Mail } from "lucide-react";

import Icon from "@acme/ui/icon";

import { siteConfig, socialConfig } from "~/config/site";
import CoverImage from "../_components/cover-image";

export const metadata: Metadata = {
  title: "About",
  description: "About me",
};

export default function AboutPage() {
  return (
    <>
      <CoverImage
        src="https://images.unsplash.com/photo-1505238680356-667803448bb6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="About"
      />
      <p className="prose prose-slate">
        Hello World! I'm <strong>Nauris Linde</strong>, a{" "}
        <strong>software engineer</strong> from Liepaja Latvia, with over a
        decade of programming experience. My journey began as a Backend Web
        Developer, where I specialized in Laravel framework while working at a
        digital agency, delivering multiple successful web projects.
      </p>
      <p className="prose prose-slate mt-4">
        Currently, I serve as a <strong>Tech Lead</strong> overseeing the
        technical aspects of our Floorplan team. My work focuses on developing
        desktop applications using the Qt Framework for floor plan editing. I'm
        also deeply involved in writing C++ algorithms and implementing them in
        web applications through WebAssembly (WASM), bridging the gap between
        high-performance desktop software and modern web technologies.
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
