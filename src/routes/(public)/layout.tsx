import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { Chatbot } from "~/components/chatbot";
import Footer from "~/components/footer";
import { Header } from "~/components/header";
import authClient from "~/lib/auth-client";
import { navbarLinks } from "~/lib/config/navbar";
import { UserType } from "~/types";

export const Route = createFileRoute("/(public)")({
  component: LayoutComponent,
  loader: ({ context: { user } }) => {
    return { user };
  },
});

const oneTapCall = async () => {
  const headers =
    process.env.NODE_ENV === "development"
      ? { "Referrer-Policy": "no-referrer-when-downgrade" }
      : undefined;
  try {
    await authClient.oneTap({
      callbackURL: "/",
      fetchOptions: {
        headers,
      },
    });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: log error
    console.error(error);
  }
};

function LayoutComponent() {
  const { user } = Route.useLoaderData();

  useEffect(() => {
    oneTapCall();
  }, []);

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
