CREATE TYPE "public"."role" AS ENUM('data', 'user', 'system', 'assistant');--> statement-breakpoint
CREATE TABLE "my-chatbot_chat" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"role" "role" NOT NULL,
	"content" text NOT NULL,
	"parts" jsonb NOT NULL
);
--> statement-breakpoint
DROP TABLE "my-chatbot_post" CASCADE;