import type { Metadata } from "next";

import CoverImage from "../_components/cover-image";

export const metadata: Metadata = {
  title: "About",
  description: "About me",
};

export default function AboutPage() {
  return (
    <CoverImage
      src="https://images.unsplash.com/photo-1505238680356-667803448bb6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="About"
    />
  );
}
