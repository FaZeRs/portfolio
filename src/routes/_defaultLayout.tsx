import { Outlet, createFileRoute } from "@tanstack/react-router";
import Footer from "~/components/footer";
import { Header } from "~/components/header";
import { navbarLinks } from "~/lib/config/navbar";

export const Route = createFileRoute("/_defaultLayout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <>
      <Header links={navbarLinks} />
      <main className="container mx-auto flex-1 py-6 md:py-10 lg:max-w-4xl xl:max-w-6xl">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
