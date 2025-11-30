import { createFileRoute } from "@tanstack/react-router";
import Stats from "~/components/github-stats";
import PageHeading from "~/components/page-heading";
import { siteConfig } from "~/lib/config/site";
import { seo } from "~/lib/seo";
import { getBaseUrl } from "~/lib/utils";

export const Route = createFileRoute("/(public)/stats")({
  component: RouteComponent,
  head: () => {
    const seoData = seo({
      title: `Stats | ${siteConfig.title}`,
      description: "Insights into my digital life",
      keywords: siteConfig.keywords,
      url: `${getBaseUrl()}/stats`,
      canonical: `${getBaseUrl()}/stats`,
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
      <PageHeading
        description="Insights into my digital life"
        title="Statistics"
      />
      <Stats />
    </>
  );
}
