import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
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

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  sortOrder: integer("sort_order").notNull(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  departmentId: integer("department_id")
    .notNull()
    .references(() => departments.id),
  name: text("name").notNull(),
  role: text("role").notNull(),
  // The site account of this member, if they have one. Not unique: someone in
  // two departments has a row in each.
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  photoUrl: text("photo_url"),
  sortOrder: integer("sort_order").notNull(),
  links: jsonb("links")
    .$type<{ type: string; url: string }[]>()
    .default(sql`'[]'::jsonb`)
    .notNull(),
});

// Better Auth tables (users, sessions, accounts, verifications). Fields mirror
// better-auth's core schema; the adapter looks them up by these export names
// because auth.ts sets usePlural. Change them only alongside a better-auth
// upgrade that changes its schema.
const authTimestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

// What a user may do on the site. auth.ts exposes it on the session; only the
// database sets it, never the user.
export const userRoles = ["member", "editor", "admin"] as const;
export type UserRole = (typeof userRoles)[number];

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    role: text("role", { enum: userRoles }).default("member").notNull(),
    ...authTimestamps,
  },
  (table) => [
    check(
      "users_valid_role",
      sql`${table.role} IN (${sql.raw(userRoles.map((role) => `'${role}'`).join(", "))})`,
    ),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...authTimestamps,
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

// One row per login method linked to a user: here, their Google account.
export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    ...authTimestamps,
  },
  (table) => [index("accounts_user_id_idx").on(table.userId)],
);

// Short-lived values, such as the OAuth state while Google redirects back.
export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...authTimestamps,
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
);
