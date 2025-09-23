ALTER TABLE "member" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "member" DROP COLUMN IF EXISTS "meta";