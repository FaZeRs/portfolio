import { createFileRoute } from "@tanstack/react-router";
import Stats from "~/components/github-stats";
import PageHeading from "~/components/page-heading";
import { siteConfig } from "~/lib/config/site";
import { seo } from "~/lib/seo";

export const Route = createFileRoute("/_defaultLayout/stats")({
  component: RouteComponent,
  head: () => ({
    meta: seo({
      title: `Stats | ${siteConfig.title}`,
      description: "Insights into my digital life",
      keywords: siteConfig.keywords,
    }),
  }),
});

function RouteComponent() {
  return (
    <>
      <PageHeading
        description="Insights into my digital life"
        title="Statistics"
      />
      <Stats />
    </>
  );
}
