import { sql } from "drizzle-orm";
import {
  check,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Minimal example table, kept as a reference for the team.
export const healthCheck = pgTable("health_check", {
  id: serial("id").primaryKey(),
  checkedAt: timestamp("checked_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// These ordered lists belong to one event, with no shared identity or separate
// lifecycle yet. Keep them in the row until cross-event queries need relations.
export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
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
  },
  (table) => [
    check(
      "events_valid_date_range",
      sql`${table.endsAt} IS NULL OR ${table.endsAt} >= ${table.startsAt}`,
    ),
  ],
);
