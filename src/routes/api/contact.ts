import { createAPIFileRoute } from "@tanstack/react-start/api";
import { Resend } from "resend";
import { siteConfig } from "~/lib/config/site";
import { env } from "~/lib/env.server";

const resend = new Resend(env.RESEND_API_KEY);

export const APIRoute = createAPIFileRoute("/api/contact")({
  POST: async ({ request }) => {
    const body = (await request.json()) as { email?: string; message?: string };
    const { email, message } = body;

    if (!message || !email) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
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
        console.log(error);
        return Response.json({ error: error }, { status: 500 });
      }

      return Response.json(data);
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  },
});
