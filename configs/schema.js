import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const JsonForms = pgTable('jsonForms', {
  id: serial('id').primaryKey(),
  jsonform: text('jsonform').notNull(),
  theme: varchar('theme'),
  background: varchar('background'),
  style: varchar('style'),
  createdBy: varchar('createdBy').notNull(),
  createdAt: varchar('createdAt').notNull(),
});