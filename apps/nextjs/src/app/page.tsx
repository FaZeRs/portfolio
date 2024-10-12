import { HydrateClient } from "~/trpc/server";
import Intro from "./_components/intro";

export const runtime = "edge";

export default function HomePage() {
  return (
    <HydrateClient>
      <Intro />
    </HydrateClient>
  );
}
