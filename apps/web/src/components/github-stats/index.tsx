import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import StatCard from "~/components/github-stats/card";
import GithubContributor from "~/components/github-stats/github-contributor";

export default function Stats() {
  const { data: githubData } = useQuery({
    queryKey: ["githubData"],
    queryFn: () => fetch("/api/stats/github").then((res) => res.json()),
  });

  const statCards = [
    {
      title: "Repositories",
      value: githubData?.repos,
      description: "Public repositories",
      link: `${githubData?.user?.html_url}?tab=repositories`,
    },
    {
      title: "Stars",
      value: githubData?.starsCount,
      description: "Total stars received",
      link: githubData?.user?.html_url,
    },
    {
      title: "Followers",
      value: githubData?.user?.followers,
      description: "People following me",
      link: githubData?.user?.html_url,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Github className="h-5 w-5 text-primary" />
        </div>
        <h2 className="font-semibold text-xl">GitHub Overview</h2>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {statCards.map((card) => (
          <StatCard card={card} key={card.title} />
        ))}
      </motion.div>

      <GithubContributor />
    </div>
  );
}
