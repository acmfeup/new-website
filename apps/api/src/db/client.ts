import { Pool } from "pg";

// ponytail: one shared pool, no DI provider. Wrap it in a Nest module when
// something needs a per-request connection or a second database.
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
