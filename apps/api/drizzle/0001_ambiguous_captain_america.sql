CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"location" text NOT NULL,
	"description" text NOT NULL,
	"cover_image" text,
	"speakers" text[] DEFAULT '{}'::text[] NOT NULL,
	"organisers" text[] DEFAULT '{}'::text[] NOT NULL,
	"photos" text[] DEFAULT '{}'::text[] NOT NULL,
	"links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
