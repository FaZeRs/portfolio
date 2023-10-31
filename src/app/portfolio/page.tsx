import { Metadata } from "next";
import ProjectsList from "~/app/_components/projects-list";

export const metadata: Metadata = {
  title: "Portfolio",
};

export default function Page() {
  return (
    <>
      <div id="portfolio" className="container mx-auto px-8 py-16 md:py-20">
        <h2 className="text-center text-4xl font-semibold uppercase text-indigo-700 sm:text-5xl lg:text-6xl">
          Check out my Portfolio
        </h2>
        <h3 className="pt-6 text-center text-xl font-medium text-black dark:text-slate-200 sm:text-2xl lg:text-3xl">
          Here&apos;s what I have done with the past
        </h3>

        <ProjectsList />
      </div>
    </>
  );
}
