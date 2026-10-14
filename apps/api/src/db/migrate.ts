import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./client";

// Production migrations, run by the api-migrate Cloud Run Job. drizzle-kit is a
// dev dependency and stays out of the image, so this uses drizzle-orm's own
// migrator, which drizzle-kit migrate calls under the hood: both record applied
// migrations in drizzle.__drizzle_migrations. Keep the defaults, or the two stop
// seeing each other's history. cwd is apps/api locally and /app in the image.
migrate(db, { migrationsFolder: "drizzle" })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
