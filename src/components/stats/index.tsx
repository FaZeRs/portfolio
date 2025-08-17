import { useQuery } from "@tanstack/react-query";

import StatCard from "~/components/stats/card";
import GithubContributor from "~/components/stats/github-contributor";

export default function Stats() {
  const { data: githubData } = useQuery({
    queryKey: ["githubData"],
    queryFn: () => fetch("/api/stats/github").then((res) => res.json()),
  });

  const statCards = [
    {
      title: "Github Repositories",
      value: githubData?.repos,
      description: "Public repositories",
      link: `${githubData?.user?.html_url}?tab=repositories`,
    },
    {
      title: "Github Stars",
      value: githubData?.starsCount,
      description: "Total stars received",
      link: githubData?.user?.html_url,
    },
    {
      title: "Github Followers",
      value: githubData?.user?.followers,
      description: "People following me",
      link: githubData?.user?.html_url,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {statCards.map((card) => (
          <StatCard card={card} key={card.title} />
        ))}
      </div>
      <GithubContributor />
    </>
  );
}
