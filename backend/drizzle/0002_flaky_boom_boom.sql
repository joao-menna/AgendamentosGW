CREATE TABLE IF NOT EXISTS "block" (
	"id" serial PRIMARY KEY NOT NULL,
	"hour_id" integer NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hour_class" ALTER COLUMN "date" SET DATA TYPE date;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "block" ADD CONSTRAINT "block_hour_id_hour_id_fk" FOREIGN KEY ("hour_id") REFERENCES "hour"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
