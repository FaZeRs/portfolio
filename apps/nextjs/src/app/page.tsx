import { HydrateClient } from "~/trpc/server";

export const runtime = "edge";

export default function HomePage() {
  return (
    <HydrateClient>
      <main className="container"></main>
    </HydrateClient>
  );
}
