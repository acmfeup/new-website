import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { parseCorsOrigins } from "../config/cors";
import {
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "../config/env";
import { db } from "../db/client";
import * as schema from "../db/schema";

export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),

  trustedOrigins: parseCorsOrigins(process.env.CORS_ORIGIN),
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      //only a hint: Google's account picker shows acmfeup.eu accounts.
      hd: "acmfeup.eu",
      // The real allow-list: only emails already in `users` can sign in.
      // The first Google login links to that row by email.
      disableSignUp: true,
    },
  },
});
