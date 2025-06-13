ALTER TABLE "my-chatbot_chatsTable" RENAME TO "my-chatbot_chats";--> statement-breakpoint
ALTER TABLE "my-chatbot_messagesTable" RENAME TO "my-chatbot_messages";--> statement-breakpoint
ALTER TABLE "my-chatbot_messages" DROP CONSTRAINT "my-chatbot_messagesTable_chatId_my-chatbot_chatsTable_id_fk";
--> statement-breakpoint
ALTER TABLE "my-chatbot_messages" ADD CONSTRAINT "my-chatbot_messages_chatId_my-chatbot_chats_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."my-chatbot_chats"("id") ON DELETE no action ON UPDATE no action;