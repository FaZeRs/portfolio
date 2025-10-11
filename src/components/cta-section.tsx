import { motion } from "framer-motion";
import { ContactForm } from "~/components/contact-form";

const CTASection = () => {
  return (
    <section className="w-full">
      <div className="flex flex-col items-center space-y-8 text-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-bold text-4xl tracking-tight md:text-5xl">
            Have a project in mind?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            I'm always excited to collaborate on interesting projects or discuss
            new opportunities. Drop me a message and I'll get back to you within
            24 hours.
          </p>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="rounded-lg border bg-background p-6 text-left md:p-8">
            <ContactForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
