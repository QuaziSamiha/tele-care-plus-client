import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/config/env.config";

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
  session: {
    //* JWT STRATEGY KEEPS SESSIONS STATELESS — NO DATABASE REQUIRED FOR SESSION STORAGE
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      //* ACCOUNT IS ONLY AVAILABLE ON THE FIRST SIGN-IN — PERSIST PROVIDER DATA INTO THE JWT AT THAT POINT
      if (account) {
        token.provider = account.provider;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      //* EXPOSE ONLY THE FIELDS CLIENT COMPONENTS NEED — NEVER FORWARD THE FULL JWT TO THE CLIENT
      session.provider = token.provider ?? "";
      session.sub = token.sub ?? "";
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
