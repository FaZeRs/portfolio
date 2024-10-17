"use client";

import type * as z from "zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@acme/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Textarea } from "@acme/ui/textarea";

import { siteConfig } from "~/config/site";
import { contactSchema } from "~/validators";
import SectionHeading from "./section-heading";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    schema: contactSchema,
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          message: values.message, // Include the message field
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      toast.success("Message sent successfully!");
      form.reset(); // Reset the form after successful submission
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section
      id="contact"
      className="mb-20 text-center sm:mb-28"
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      viewport={{
        once: true,
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-auto">
                  <FormControl>
                    <Input type="email" placeholder="Your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-auto">
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here."
                      {...field}
                      className="h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="group"
            >
              <Send className="mr-2 h-4 w-4" /> Submit
            </Button>
          </form>
        </Form>
      </div>
    </motion.section>
  );
};

export default Contact;
