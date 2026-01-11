import { UserType } from "@acme/types";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Chatbot } from "~/components/chatbot";
import Footer from "~/components/footer";
import { Header } from "~/components/header";
import { navbarLinks } from "~/lib/constants/navbar";

export const Route = createFileRoute("/(public)")({
  component: LayoutComponent,
  loader: ({ context: { user } }) => ({ user }),
});

function LayoutComponent() {
  const { user } = Route.useLoaderData();

  return (
    <>
      <Header links={navbarLinks} user={user as UserType} />
      <main className="container mx-auto flex-1 px-4 py-4 sm:px-6 sm:py-6 md:py-10 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
