import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Chatbot } from "~/components/chatbot";
import Footer from "~/components/footer";
import { Header } from "~/components/header";
import { navbarLinks } from "~/lib/config/navbar";
import { UserType } from "~/types";

export const Route = createFileRoute("/(public)")({
  component: LayoutComponent,
  loader: ({ context: { user } }) => {
    return { user };
  },
});

function LayoutComponent() {
  const { user } = Route.useLoaderData();

  return (
    <>
      <Header links={navbarLinks} user={user as UserType} />
      <main className="container mx-auto flex-1 py-6 md:py-10 lg:max-w-4xl xl:max-w-6xl">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
