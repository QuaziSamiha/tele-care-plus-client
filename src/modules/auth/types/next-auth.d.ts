// * Augments a third-party library's types, must be ambient
import type { DefaultSession } from "next-auth";

//* EXTEND NEXT-AUTH SESSION WITH CUSTOM FIELDS EXPOSED TO CLIENT COMPONENTS
declare module "next-auth" {
  interface Session {
    provider?: string;
    sub?: string;
    user: DefaultSession["user"];
  }
}

//* EXTEND NEXT-AUTH JWT TO PERSIST PROVIDER AND IDENTITY TOKEN BETWEEN REQUESTS
declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    idToken?: string;
  }
}
