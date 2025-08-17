import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Header } from "~/components/header";
import { dashboardNavbarLinks } from "~/lib/config/navbar";

export const Route = createFileRoute("/_dashboardLayout")({
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
});

function LayoutComponent() {
  return (
    <>
      <Header links={dashboardNavbarLinks} />
      <main className="container mx-auto flex-1 py-6 md:py-10 lg:max-w-4xl xl:max-w-6xl">
        <Outlet />
      </main>
    </>
  );
}
