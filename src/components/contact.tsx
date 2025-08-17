import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useAppForm } from "~/components/ui/form";
import { siteConfig } from "~/lib/config/site";
import { contactSchema } from "~/lib/validators";
import SectionHeading from "./section-heading";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useAppForm({
    defaultValues: {
      email: "",
      message: "",
    },
    validators: {
      onChange: contactSchema,
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.value.email,
            message: values.value.message,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        toast.success("Message sent successfully!");
        form.reset();
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <motion.section
      className="mb-20 text-center sm:mb-28"
      id="contact"
      initial={{
        opacity: 0,
      }}
      transition={{
        duration: 1,
      }}
      viewport={{
        once: true,
      }}
      whileInView={{
        opacity: 1,
      }}
    >
      <SectionHeading>Contact me</SectionHeading>

      <p className="-mt-6 text-muted-foreground">
        Please contact me directly at{" "}
        <a className="underline" href={`mailto:${siteConfig.links.mail}`}>
          {siteConfig.links.mail}
        </a>{" "}
        or through this form.
      </p>

      <div className="mx-auto mt-8 max-w-xl">
        <form.AppForm>
          <form
            className="flex w-full flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.AppField name="email">
              {(field) => (
                <field.FormItem>
                  <field.FormControl>
                    <Input
                      autoComplete="email"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Your email"
                      type="email"
                      value={field.state.value}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            </form.AppField>

            <form.AppField name="message">
              {(field) => (
                <field.FormItem>
                  <field.FormControl>
                    <Textarea
                      className="h-32"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Type your message here."
                      value={field.state.value}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            </form.AppField>

            <Button
              className="group"
              disabled={isLoading}
              type="submit"
              variant="default"
            >
              <Send className="mr-2 h-4 w-4" /> Submit
            </Button>
          </form>
        </form.AppForm>
      </div>
    </motion.section>
  );
};

export default Contact;
