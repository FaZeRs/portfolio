import { siteConfig } from "@acme/config";
import { createFileRoute } from "@tanstack/react-router";
import PageHeading from "~/components/page-heading";
import Uses from "~/components/uses";
import { seo } from "~/lib/seo";
import { getBaseUrl } from "~/lib/utils";

export const Route = createFileRoute("/(public)/uses")({
  component: RouteComponent,
  head: () => {
    const seoData = seo({
      title: `Uses | ${siteConfig.title}`,
      description:
        "These are the tools I use to get my work done. Links marked with (*) are affiliate links.",
      keywords: siteConfig.keywords,
      url: `${getBaseUrl()}/uses`,
      canonical: `${getBaseUrl()}/uses`,
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
        description="These are the tools I use to get my work done. Links marked with (*) are affiliate links. It does not cost you anything to use them, but I get a small commission if you do."
        title="Uses"
      />

      <Uses />
    </>
  );
}
