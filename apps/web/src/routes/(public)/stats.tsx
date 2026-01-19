import { siteConfig } from "@acme/config";
import { createFileRoute } from "@tanstack/react-router";
import Stats from "~/components/github-stats";
import PageHeading from "~/components/page-heading";
import { seo } from "~/lib/seo";
import { getBaseUrl } from "~/lib/utils";

export const Route = createFileRoute("/(public)/stats")({
  component: RouteComponent,
  head: () => {
    const seoData = seo({
      title: `Stats | ${siteConfig.title}`,
      description:
        "Development activity and contributions on GitHub. Track record of consistent coding and open source contributions demonstrating active development expertise.",
      keywords:
        "Developer Statistics, GitHub Activity, Open Source Contributions, Active Developer, Coding Activity, Software Development Track Record",
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
        description="Development activity and open source contributions"
        title="Statistics"
      />
      <Stats />
    </>
  );
}
