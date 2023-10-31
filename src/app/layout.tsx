import "~/styles/globals.css";

import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { headers } from "next/headers";
import { Toaster } from "react-hot-toast";

import { env } from "~/env.mjs";
import { TRPCReactProvider } from "~/trpc/react";
import Header from "~/app/_components/header";
import Footer from "~/app/_components/footer";
import BackToTop from "./_components/back-to-top";
import { Providers } from "./providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: env.NEXT_PUBLIC_SITE_NAME!,
    template: `%s | ${env.NEXT_PUBLIC_SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} bg-gray-100 font-sans antialiased dark:bg-gray-900`}
      >
        <Providers>
          <Toaster position="bottom-center" />
          <Header />
          <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
          <Footer />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
