import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  ErrorComponent,
  notFound,
} from "@tanstack/react-router";
import { TRPCClientError } from "@trpc/client";
import { NotFound } from "~/components/not-found";
import PageHeading from "~/components/page-heading";
import ServiceContent from "~/components/services/service-content";
import { siteConfig } from "~/lib/config/site";
import { seo } from "~/lib/seo";
import { getBaseUrl } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/(public)/services/$serviceId")({
  loader: async ({ params: { serviceId }, context: { trpc, queryClient } }) => {
    try {
      const data = await queryClient.ensureQueryData(
        trpc.service.bySlug.queryOptions({ slug: serviceId })
      );
      return {
        title: data?.title,
        description: data?.description,
        image: data?.imageUrl,
        slug: data?.slug,
      };
    } catch (error) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "NOT_FOUND"
      ) {
        throw notFound();
      }
      throw error;
    }
  },
  head: ({ loaderData }) => {
    const seoData = seo({
      title: `${loaderData?.title} | ${siteConfig.title}`,
      description: loaderData?.description,
      keywords: siteConfig.keywords,
      image: loaderData?.image,
      url: `${getBaseUrl()}/services/${loaderData?.slug}`,
      canonical: `${getBaseUrl()}/services/${loaderData?.slug}`,
    });
    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
  component: RouteComponent,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => {
    return <NotFound>Service not found</NotFound>;
  },
});

function RouteComponent() {
  const { serviceId } = Route.useParams();
  const trpc = useTRPC();
  const service = useSuspenseQuery(
    trpc.service.bySlug.queryOptions({ slug: serviceId })
  );

  return (
    <div>
      <PageHeading
        description={service.data?.description}
        title={service.data?.title}
      />
      <ServiceContent service={service.data} />
    </div>
  );
}
