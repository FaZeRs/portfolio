import { siteConfig } from "@acme/config";
import { UserType } from "@acme/types";
import { Skeleton } from "@acme/ui/skeleton";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import SignInButton from "~/components/auth/sign-in-button";
import SignInModal from "~/components/auth/sign-in-modal";
import MessageForm from "~/components/guestbook/message-form";
import Messages from "~/components/guestbook/messages";
import PageHeading from "~/components/page-heading";
import { seo } from "~/lib/seo";
import { useTRPC } from "~/lib/trpc";
import { getBaseUrl } from "~/lib/utils";

export const Route = createFileRoute("/(public)/guestbook")({
  component: RouteComponent,
  loader: async ({ context: { trpc, queryClient, user } }) => {
    await queryClient.prefetchQuery(trpc.guestbook.all.queryOptions());
    return { user };
  },
  head: () => {
    const seoData = seo({
      title: `Guestbook | ${siteConfig.title}`,
      description: "A place for you to leave your comments and feedback.",
      keywords: siteConfig.keywords,
      url: `${getBaseUrl()}/guestbook`,
      canonical: `${getBaseUrl()}/guestbook`,
    });
    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
});

function GuestbookSkeleton() {
  return (
    <div className="mt-10 flex flex-col gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: valid use case
        <div className="flex gap-3 px-3" key={i}>
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="flex min-h-8 items-center gap-4">
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RouteComponent() {
  const trpc = useTRPC();
  const {
    data: messages,
    isLoading,
    isFetching,
  } = useSuspenseQuery(trpc.guestbook.all.queryOptions());
  const { user } = Route.useLoaderData();

  return (
    <>
      <PageHeading
        description="A place for you to leave your comments and feedback."
        title="Guestbook"
      />

      {user ? <MessageForm user={user as UserType} /> : <SignInButton />}
      {isLoading || isFetching ? (
        <GuestbookSkeleton />
      ) : (
        <Messages messages={messages} />
      )}
      <SignInModal />
    </>
  );
}
