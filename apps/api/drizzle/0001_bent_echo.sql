CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"location" text NOT NULL,
	"description" text NOT NULL,
	"cover_image" text,
	"speakers" text[] DEFAULT '{}'::text[] NOT NULL,
	"organisers" text[] DEFAULT '{}'::text[] NOT NULL,
	"photos" text[] DEFAULT '{}'::text[] NOT NULL,
	"links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug"),
	CONSTRAINT "events_valid_date_range" CHECK ("events"."ends_at" IS NULL OR "events"."ends_at" >= "events"."starts_at")
);
--> statement-breakpoint
DROP TABLE "health_check" CASCADE;