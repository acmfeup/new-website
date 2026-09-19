import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";

// ponytail: placeholder table, only here so the migration pipeline has
// something to apply and the CI drift check has a baseline. Drop it in the
// first PR that adds a real table.
export const healthCheck = pgTable("health_check", {
  id: serial("id").primaryKey(),
  checkedAt: timestamp("checked_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
