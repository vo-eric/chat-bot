CREATE TABLE "my-chatbot_chatsTable" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "my-chatbot_chat" RENAME TO "my-chatbot_messagesTable";--> statement-breakpoint
ALTER TABLE "my-chatbot_messagesTable" ADD COLUMN "chatId" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "my-chatbot_messagesTable" ADD CONSTRAINT "my-chatbot_messagesTable_chatId_my-chatbot_chatsTable_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."my-chatbot_chatsTable"("id") ON DELETE no action ON UPDATE no action;