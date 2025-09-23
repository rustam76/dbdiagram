-- Membuat tabel member
CREATE TABLE IF NOT EXISTS "member" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"meta" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Membuat tabel project
CREATE TABLE IF NOT EXISTS "project" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"meta" jsonb NOT NULL,
	"is_deleted" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Membuat tabel project_member
CREATE TABLE IF NOT EXISTS "project_member" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text,
	"project_id" text,
	"permission" jsonb NOT NULL
);

-- Membuat tabel resource
CREATE TABLE IF NOT EXISTS "resource" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text,
	"code" text NOT NULL,
	"model" jsonb NOT NULL
);

-- Menambahkan foreign key constraints
ALTER TABLE "project_member" ADD CONSTRAINT "project_member_member_id_fk" 
    FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "project_member" ADD CONSTRAINT "project_member_project_id_fk" 
    FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "resource" ADD CONSTRAINT "resource_project_id_fk" 
    FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;