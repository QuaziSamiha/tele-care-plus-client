import { z } from "zod";
import { PaymentMethod } from "../types/checkout.type";

export const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .min(8, "Enter a valid phone number"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  street: z.string().min(1, "Street name & house number is required"),
  state: z.string().min(1, "Please select a state"),
  region: z.string().min(1, "Please select a region"),
  zipCode: z
    .string()
    .min(1, "ZIP code is required")
    .regex(/^[0-9]{4,6}$/, "Enter a valid ZIP code"),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    message: "Please select a payment method",
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
