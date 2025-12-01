import { siteConfig } from "@acme/config";
import { createFileRoute } from "@tanstack/react-router";
import { Resend } from "resend";
import { env } from "~/lib/env/server";

const resend = new Resend(env.RESEND_API_KEY);

export const Route = createFileRoute("/api/contact/")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL)) {
          return Response.json(
            { error: "Email service is not configured" },
            { status: 500 }
          );
        }

        const body = (await request.json()) as {
          email?: string;
          message?: string;
        };
        const { email, message } = body;

        if (!(message && email)) {
          return Response.json(
            { error: "Missing required fields" },
            { status: 400 }
          );
        }

        try {
          const { data, error } = await resend.emails.send({
            from: env.RESEND_FROM_EMAIL as string,
            replyTo: email,
            to: [siteConfig.links.mail],
            subject: "Contact Message",
            text: message,
          });

          if (error) {
            return Response.json({ error }, { status: 500 });
          }

          return Response.json(data);
        } catch (error) {
          return Response.json({ error }, { status: 500 });
        }
      },
    },
  },
});
