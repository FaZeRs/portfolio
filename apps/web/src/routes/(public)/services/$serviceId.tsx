import { siteConfig } from "@acme/config";
import { NotFound } from "@acme/ui/not-found";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  ErrorComponent,
  notFound,
} from "@tanstack/react-router";
import PageHeading from "~/components/page-heading";
import ServiceContent from "~/components/services/service-content";
import { queryKeys } from "~/lib/query-keys";
import { seo } from "~/lib/seo";
import { $getServiceBySlug } from "~/lib/server";
import { getBaseUrl } from "~/lib/utils";

export const Route = createFileRoute("/(public)/services/$serviceId")({
  loader: async ({ params: { serviceId }, context: { queryClient } }) => {
    try {
      const data = await queryClient.ensureQueryData({
        queryKey: queryKeys.service.detail(serviceId),
        queryFn: () => $getServiceBySlug({ data: { slug: serviceId } }),
      });
      return {
        title: data?.title,
        description: data?.description,
        image: data?.imageUrl,
        slug: data?.slug,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === "Service not found" ||
          error.message === "Service is not public")
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
  notFoundComponent: () => <NotFound>Service not found</NotFound>,
});

function RouteComponent() {
  const { serviceId } = Route.useParams();
  const service = useSuspenseQuery({
    queryKey: queryKeys.service.detail(serviceId),
    queryFn: () => $getServiceBySlug({ data: { slug: serviceId } }),
  });

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
