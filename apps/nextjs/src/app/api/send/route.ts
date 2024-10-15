import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { ContactEmail } from "@acme/transactional/emails/contact";

import { siteConfig } from "~/config/site";
import { env } from "~/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; message?: string };
  const { email, message } = body;

  if (!message || !email) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      replyTo: email,
      to: [siteConfig.links.mail],
      subject: "Contact Message",
      react: ContactEmail({ email, message }),
    });

    if (error) {
      console.log(error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
