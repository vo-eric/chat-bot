// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { jsonb, pgEnum, pgTableCreator } from "drizzle-orm/pg-core";
import { type Message } from "ai";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `my-chatbot_${name}`);
export const roleEnum = pgEnum("role", ["data", "user", "system", "assistant"]);

export const chatsTable = createTable("chatsTable", (d) => ({
  id: d.varchar({ length: 255 }).primaryKey(),
  createdAt: d.timestamp().defaultNow().notNull(),
  updatedAt: d.timestamp().defaultNow().notNull(),
}));

export const messagesTable = createTable("messagesTable", (d) => ({
  id: d.varchar({ length: 255 }).primaryKey(),
  createdAt: d.timestamp().defaultNow().notNull(),
  role: roleEnum("role").notNull(),
  content: d.text().notNull(),
  parts: jsonb().$type<Message["parts"]>().notNull(),
  chatId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => chatsTable.id),
}));
