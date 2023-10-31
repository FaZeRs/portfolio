import { env } from "~/env.mjs";
import Head from "~/app/_components/head";
import ContactForm from "~/app/_components/contact-form";

export default function Page() {
  const contactEmail = env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <>
      <Head title="Contact" />
      <div className="container mx-auto px-8 py-16 md:py-20">
        <h2
          className="
            font-header
            text-center
            text-4xl
            font-semibold
            uppercase
            text-indigo-700
            sm:text-5xl
            lg:text-6xl
          "
        >
          Here&apos;s a contact form
        </h2>
        <h4
          className="
            font-header
            pt-6
            text-center
            text-xl
            font-medium
            text-black
            dark:text-slate-200
            sm:text-2xl
            lg:text-3xl
          "
        >
          Have Any Questions?
        </h4>
        <div className="mx-auto w-full pt-5 text-center sm:w-2/3 lg:pt-6">
          <p className="font-body text-slate-600 dark:text-slate-400">
            Email me at{" "}
            <a className="italic" href="mailto:${contactEmail}">
              {contactEmail}
            </a>{" "}
            or message me here:
          </p>
        </div>
        <ContactForm />
      </div>
    </>
  );
}
