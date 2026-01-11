import { siteConfig } from "@acme/config";
import { Button } from "@acme/ui/button";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Mail } from "lucide-react";
import { ContactForm } from "~/components/contact-form";

const benefits = [
  "Free initial consultation",
  "Clear project timeline",
  "Transparent pricing",
  "Ongoing support included",
];

const CTASection = () => (
  <section className="w-full">
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card via-card to-muted/30 p-5 sm:rounded-3xl sm:p-8 md:p-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/10 to-pink-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 blur-3xl" />

      <div className="relative grid gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left side - Content */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-3 font-medium text-primary text-sm uppercase tracking-widest">
            Let's Work Together
          </span>
          <h2 className="font-bold text-2xl tracking-tight sm:text-3xl md:text-4xl">
            Ready to bring your idea to life?
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Whether you have a detailed spec or just a rough concept, I'm here
            to help turn your vision into reality. Let's discuss your project
            and find the best path forward.
          </p>

          {/* Benefits */}
          <ul className="mt-6 space-y-3">
            {benefits.map((benefit) => (
              <li className="flex items-center gap-2" key={benefit}>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-muted-foreground">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Alternative CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="outline">
              <a
                href={siteConfig.calendlyUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule a call
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`mailto:${siteConfig.links.mail}`}>
                <Mail className="mr-2 h-4 w-4" />
                {siteConfig.links.mail}
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Right side - Form */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: 20 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="rounded-xl border border-border/50 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6 md:p-8 dark:bg-card">
            <h3 className="mb-2 font-semibold text-lg">Send a message</h3>
            <p className="mb-6 text-muted-foreground text-sm">
              I typically respond within 24 hours
            </p>
            <ContactForm />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CTASection;
