import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import type { ServiceType } from "~/types";
import TechStacks from "../tech-stacks";
import { Spinner } from "../ui/spinner";
import ZoomImage from "../zoom-image";
import ServiceContact from "./service-contact";

const CustomMDX = lazy(() => import("../mdx/mdx"));

type ServiceContentProps = {
  service: ServiceType;
};

export default function ServiceContent({
  service,
}: Readonly<ServiceContentProps>) {
  const { stacks, imageUrl, title, content } = service;
  const thumbnailUrl =
    imageUrl ??
    `https://placehold.co/1000x600/darkgray/white/png?text=${encodeURIComponent(title)}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row lg:items-center">
        {stacks && stacks.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-[15px] text-neutral-700 dark:text-neutral-300">
              Tech Stack :
            </span>

            <TechStacks techStack={stacks} />
          </div>
        )}
      </div>

      <div className="relative aspect-[16/9] overflow-hidden">
        <ZoomImage
          alt={title}
          className="scale-100 rounded-lg border object-cover blur-0 grayscale-0 duration-700 ease-in-out hover:scale-105"
          height={700}
          src={thumbnailUrl}
          width={1200}
        />
      </div>

      {content && (
        <div className="mt-5 space-y-6 leading-[1.8] dark:text-neutral-300">
          <ClientOnly>
            <Suspense fallback={<Spinner className="size-6" />}>
              <article className="prose prose-slate dark:prose-invert !max-w-none">
                <CustomMDX source={content} />
              </article>
            </Suspense>
          </ClientOnly>
        </div>
      )}

      <div className="mt-8">
        <ServiceContact />
      </div>
    </div>
  );
}
