import { existsSync } from "node:fs";
import { resolve } from "node:path";

//  node's own env-file loader, so no dotenv dependency. Every script
// in this package runs with cwd at apps/api, so the root .env is two up.
const envFile = resolve(process.cwd(), "../../.env");
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

// Defaults match docker-compose.yml so a fresh clone needs no .env at all.
// `||`, not `??`: a blanked value in .env should fall back to the default too.
export const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://acmfeup:acmfeup@localhost:5432/acmfeup";

// True only for a database on this machine, such as docker-compose's. Scripts
// that write test data directly check this first.
export function isLocalDatabase(url: string): boolean {
  const { hostname } = new URL(url);
  return ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
}

export const API_PORT = Number(process.env.API_PORT || 4000);

// Public URL of this API. Google redirects back to <this>/api/auth/callback/google.
export const BETTER_AUTH_URL =
  process.env.BETTER_AUTH_URL || "http://localhost:4000";

// No default on purpose: Better Auth falls back to its own dev secret outside
// production and refuses to start in production without one.
export const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || undefined;

// Empty means Google login is unavailable; the API still boots.
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
