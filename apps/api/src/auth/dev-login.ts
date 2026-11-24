import { betterAuth } from "better-auth";
import { testUtils } from "better-auth/plugins";
import { DATABASE_URL, isLocalDatabase } from "../config/env";
import { db, pool } from "../db/client";
import { users } from "../db/schema";
import { authOptions } from "./auth";
import { type PersonaName, personas } from "./personas";

async function devLogin(name: string) {
  // It writes users and sessions straight into the database: never Neon.
  if (!isLocalDatabase(DATABASE_URL)) {
    throw new Error("dev-login only runs against a local database.");
  }
  if (!Object.hasOwn(personas, name)) {
    throw new Error(
      `Unknown persona "${name}". Pick one of: ${Object.keys(personas).join(", ")}`,
    );
  }
  const persona = personas[name as PersonaName];

  // Same email every time, so running it again reuses the user.
  const [user] = await db
    .insert(users)
    .values({ id: crypto.randomUUID(), ...persona, emailVerified: true })
    .onConflictDoUpdate({
      target: users.email,
      set: { name: persona.name, role: persona.role },
    })
    .returning();

  // A second instance with the test plugin, kept out of the API's own `auth`.
  // Same secret and tables, so the API accepts the session it creates.
  const { test } = await betterAuth({
    ...authOptions,
    plugins: [testUtils()],
  }).$context;
  const [cookie] = (await test.login({ userId: user.id })).cookies;

  console.log(`Logged in as ${persona.email} (${persona.role}). Paste this in the browser console on http://localhost:3000:

document.cookie = "${cookie.name}=${cookie.value}; path=/"
`);
}

devLogin(process.argv[2] ?? "member")
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
