import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
  CORS_ORIGINS,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "../config/env";
import { db } from "../db/client";
import * as schema from "../db/schema";
import { userRoles } from "../db/schema";

// Shared with the dev-login script, which adds its test-only plugin on top.
export const authOptions = {
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),

  trustedOrigins: CORS_ORIGINS,
  user: {
    additionalFields: {
      // input: false, so no request can set or change its own role.
      role: {
        type: [...userRoles],
        defaultValue: "member",
        input: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      // Only a hint: Google's account picker shows acmfeup.eu accounts.
      hd: "acmfeup.eu",
      // The real allow-list: only emails already in `users` can sign in.
      // The first Google login links to that row by email.
      disableSignUp: true,
    },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth(authOptions);
