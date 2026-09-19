import { Logger } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DATABASE_URL } from "../config/env";
import * as schema from "./schema";

// ponytail: one shared pool, no DI provider. Wrap it in a Nest module when
// something needs a per-request connection or a second database.
export const pool = new Pool({
  connectionString: DATABASE_URL,
  // Fail fast when the host drops packets, so /health reports the db as down
  // instead of hanging until the OS TCP timeout.
  connectionTimeoutMillis: 5000,
});

// An idle client losing its connection (Postgres restarted) emits "error" on
// the pool. Without a listener Node treats it as uncaught and the API exits.
pool.on("error", (error) => new Logger("Database").error(error));

export const db = drizzle(pool, { schema });
