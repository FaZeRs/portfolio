import * as z from "zod";

export const contactSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  message: z
    .string()
    .min(2, { message: "Message must be at least 2 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
});
