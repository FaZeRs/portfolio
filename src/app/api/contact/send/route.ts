import { NextResponse } from "next/server";
import ContactEmail from "react-email/emails/contact";
import { Resend } from "resend";
import { env } from "~/env.mjs";

const resend = new Resend(env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, message } = await request.json();
  try {
    const data = await resend.emails.send({
      from: email,
      to: ["naurislinde@gmail.com"],
      subject: "Portfolio Contact message",
      react: ContactEmail({ name, email, message }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
