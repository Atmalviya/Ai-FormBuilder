import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const JsonForms = pgTable('jsonForms', {
  id: serial('id').primaryKey(),
  jsonform: text('jsonform').notNull(),
  createdBy: varchar('createdBy').notNull(),
  createdAt: varchar('createdAt').notNull(),
});