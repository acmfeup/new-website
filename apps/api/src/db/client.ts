import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DATABASE_URL } from "../config/env";
import * as schema from "./schema";

// ponytail: one shared pool, no DI provider. Wrap it in a Nest module when
// something needs a per-request connection or a second database.
export const pool = new Pool({ connectionString: DATABASE_URL });

export const db = drizzle(pool, { schema });
