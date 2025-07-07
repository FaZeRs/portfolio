import { createFileRoute } from "@tanstack/react-router";
import PageHeading from "~/components/page-heading";
import Stats from "~/components/stats";

export const Route = createFileRoute("/_defaultLayout/stats")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PageHeading
        title="Statistics"
        description="Insights into my digital life"
      />
      <Stats />
    </>
  );
}
