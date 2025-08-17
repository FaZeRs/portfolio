import { createFileRoute } from "@tanstack/react-router";
import PageHeading from "~/components/page-heading";
import Uses from "~/components/uses";
import { siteConfig } from "~/lib/config/site";
import { seo } from "~/lib/seo";

export const Route = createFileRoute("/_defaultLayout/uses")({
  component: RouteComponent,
  head: () => ({
    meta: seo({
      title: `Uses | ${siteConfig.title}`,
      description:
        "These are the tools I use to get my work done. Links marked with",
      keywords: siteConfig.keywords,
    }),
  }),
});

function RouteComponent() {
  return (
    <>
      <PageHeading
        description="These are the tools I use to get my work done. Links marked with (*)
      are affiliate links. It does not cost you anything to use them, but
      I get a small commission if you do."
        title="Uses"
      />

      <Uses />
    </>
  );
}
