"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

import Input from "./input";
import Textarea from "./textarea";
import Button from "./button";

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  message: z.string().min(1),
});

type FormData = z.infer<typeof formSchema>;

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (form: FormData) => {
    await fetch("/api/contact/send", {
      method: "POST",
      body: JSON.stringify(form),
    });
    toast.success("Message sent sucessfuly!");
    reset();
  };

  return (
    <form
      className="mx-auto w-full pt-10 sm:w-3/4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex flex-col md:flex-row">
        <div className="mb-6 mr-3 w-full md:mb-0 md:w-1/2 lg:mr-5">
          <Input
            {...register("name")}
            name="name"
            type="text"
            placeholder="Your Full Name"
            required={true}
            errors={errors}
          />
        </div>
        <div className="mb-6 mt-6 w-full md:mb-0 md:ml-3 md:mt-0 md:w-1/2 lg:ml-5">
          <Input
            {...register("email")}
            name="email"
            type="email"
            placeholder="Your Email"
            required={true}
            errors={errors}
          />
        </div>
      </div>
      <div className="mb-6 mr-3 mt-6 w-full md:mb-0 lg:mr-5">
        <Textarea
          {...register("message")}
          name="message"
          placeholder="Your Message"
          required={true}
          errors={errors}
        />
      </div>
      <Button
        className="mt-6 flex items-center justify-center bg-indigo-500 text-white hover:bg-indigo-700"
        fontSize="text-lg font-bold uppercase"
        sizeClass="px-8 py-3"
        type="submit"
        loading={isSubmitting}
      >
        Send <ChevronRightIcon className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ContactForm;
