CREATE TABLE "health_check" (
	"id" serial PRIMARY KEY NOT NULL,
	"checked_at" timestamp with time zone DEFAULT now() NOT NULL
);
