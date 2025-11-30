import { getTOC } from "@acme/utils";
import { createFileRoute } from "@tanstack/react-router";
import changelogContent from "../../../../../../CHANGELOG.md?raw";

export const Route = createFileRoute("/api/changelog/")({
  server: {
    handlers: {
      GET: () => {
        try {
          const content = changelogContent as string;
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
