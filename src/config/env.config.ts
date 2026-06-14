import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

//* SINGLE SOURCE OF TRUTH FOR ALL ENVIRONMENT VARIABLES
//* VALIDATED AT BUILD TIME — APP WILL THROW IMMEDIATELY IF A REQUIRED VAR IS MISSING OR MALFORMED
export const env = createEnv({
  //* SET SKIP_ENV_VALIDATION=1 IN CI OR WHEN RUNNING yarn build WITHOUT SECRETS AVAILABLE
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  //* SERVER-ONLY SECRETS — NEVER ACCESSIBLE IN CLIENT COMPONENTS OR THE BROWSER BUNDLE
  server: {
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url(),
  },

  //* CLIENT-SAFE VARIABLES — MUST BE PREFIXED WITH NEXT_PUBLIC_
  client: {
    NEXT_PUBLIC_API_BASE_URL: z
      .string()
      .url()
      .default("http://localhost:5001/api/v1"),
    NEXT_PUBLIC_APP_ENV: z.string().optional(),
    NEXT_PUBLIC_IMAGE_HOST: z.string().optional(),
  },

  //* EXPLICIT RUNTIME MAPPING — REQUIRED BY NEXT.JS TO INLINE CLIENT VARS AT BUILD TIME
  runtimeEnv: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_IMAGE_HOST: process.env.NEXT_PUBLIC_IMAGE_HOST,
  },
});
