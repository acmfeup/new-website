import { sql } from "drizzle-orm";
import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// ponytail: placeholder table, only here so the migration pipeline has
// something to apply and the CI drift check has a baseline. Drop it in the
// first PR that adds a real table.
export const healthCheck = pgTable("health_check", {
  id: serial("id").primaryKey(),
  checkedAt: timestamp("checked_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// These ordered lists belong to one event, with no shared identity or separate
// lifecycle yet. Keep them in the row until cross-event queries need relations.
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  date: timestamp("date", { withTimezone: true, mode: "string" }).notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image"),
  speakers: text("speakers").array().default(sql`'{}'::text[]`).notNull(),
  organisers: text("organisers").array().default(sql`'{}'::text[]`).notNull(),
  photos: text("photos").array().default(sql`'{}'::text[]`).notNull(),
  links: jsonb("links")
    .$type<{ label: string; url: string }[]>()
    .default(sql`'[]'::jsonb`)
    .notNull(),
});
