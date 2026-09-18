import { existsSync } from "node:fs";
import { resolve } from "node:path";

// ponytail: Node's own env-file loader, so no dotenv dependency. Every script
// in this package runs with cwd at apps/api, so the root .env is two up.
const envFile = resolve(process.cwd(), "../../.env");
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

// Defaults match docker-compose.yml so a fresh clone needs no .env at all.
export const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://plataforma:plataforma@localhost:5432/plataforma";

export const API_PORT = Number(process.env.API_PORT ?? 4000);
