import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import SectionHeading from "../section-heading";
import ServiceCard from "./service-card";

export default function Services() {
  const trpc = useTRPC();
  const { data: services } = useSuspenseQuery(
    trpc.service.allPublic.queryOptions()
  );

  if (services.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionHeading>Services</SectionHeading>
      <div className="grid gap-10 sm:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </div>
  );
}
