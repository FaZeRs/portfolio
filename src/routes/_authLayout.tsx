import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authLayout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <main className="container mx-auto flex-1 py-6 md:py-10 lg:max-w-4xl xl:max-w-6xl">
      <Outlet />
    </main>
  );
}
