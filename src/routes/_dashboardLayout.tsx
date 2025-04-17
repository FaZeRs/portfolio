import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "~/lib/components/header";
import { dashboardNavbarLinks } from "~/lib/config/navbar";
export const Route = createFileRoute("/_dashboardLayout")({
  component: LayoutComponent,
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
