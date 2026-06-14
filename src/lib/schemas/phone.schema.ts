import { z } from "zod";

/**
 * Reusable Thai Phone validation logic
 */
export const thaiPhoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .refine(
    (value) => {
      // 1. Remove spaces, dashes, and parentheses just like your backend
      const cleanValue = value.replace(/[\s()-]/g, "");

      // 2. Define the patterns
      const patterns = [
        /^\+66\d{8,9}$/, // International
        /^0[689]\d{8}$/, // Mobile
        /^0[2-57]\d{7}$/, // Landline
      ];

      // 3. Test the cleaned value
      return patterns.some((pattern) => pattern.test(cleanValue));
    },
    {
      message:
        "Phone must be a valid Thai format: 0812345678, 021234567, or +66812345678",
    },
  );
