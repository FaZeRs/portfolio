import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createFileRoute } from "@tanstack/react-router";
import { getTOC } from "~/lib/utils";

export const Route = createFileRoute("/api/changelog/")({
  server: {
    handlers: {
      GET: () => {
        try {
          // Read CHANGELOG.md from the project root
          const changelogPath = join(process.cwd(), "CHANGELOG.md");
          const content = readFileSync(changelogPath, "utf-8");
          const toc = getTOC(content ?? "");

          return new Response(JSON.stringify({ content, toc }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: "Failed to load changelog",
              message: error instanceof Error ? error.message : "Unknown error",
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      },
    },
  },
});
