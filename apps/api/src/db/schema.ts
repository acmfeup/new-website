import { sql } from "drizzle-orm";
import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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
