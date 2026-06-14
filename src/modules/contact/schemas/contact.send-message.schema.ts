
import { thaiPhoneSchema } from "@/lib/schemas/phone.schema";
import { z } from "zod";

export const ContactSendMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: thaiPhoneSchema,
  message: z.string().trim().min(1, { message: "Message is required" }),
});

export type ContactSendMessageFormValues = z.infer<typeof ContactSendMessageSchema>;
