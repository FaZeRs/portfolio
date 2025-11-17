import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Header } from "~/components/header";
import { dashboardNavbarLinks } from "~/lib/config/navbar";
import { UserType } from "~/types";

export const Route = createFileRoute("/dashboard")({
  component: LayoutComponent,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/signin" });
    }

    if (context.user.role !== "admin") {
      throw redirect({ to: "/" });
    }

    // `context.queryClient` is also available in our loaders
    // https://tanstack.com/start/latest/docs/framework/react/examples/start-basic-react-query
    // https://tanstack.com/router/latest/docs/framework/react/guide/external-data-loading
  },
  loader: ({ context }) => ({ user: context.user }),
});

function LayoutComponent() {
  const { user } = Route.useLoaderData();
  return (
    <>
      <Header links={dashboardNavbarLinks} user={user as UserType} />
      <main className="container mx-auto flex-1 py-6 md:py-10 lg:max-w-4xl xl:max-w-6xl">
        <Outlet />
      </main>
    </>
  );
}
