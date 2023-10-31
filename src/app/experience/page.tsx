import { Metadata } from "next";
import ExperiencesList from "~/app/_components/experiences-list";

export const metadata: Metadata = {
  title: "Experience",
};

export default function Page() {
  return (
    <>
      <div className="container mx-auto px-8 py-16 md:py-20">
        <h2 className="font-header text-center text-4xl font-semibold uppercase text-indigo-700 sm:text-5xl lg:text-6xl">
          My experience
        </h2>
        <h3 className="font-header pt-6 text-center text-xl font-medium text-black dark:text-slate-200 sm:text-2xl lg:text-3xl">
          Here&rsquo;s what I did before
        </h3>

        <ExperiencesList />
      </div>
    </>
  );
}
