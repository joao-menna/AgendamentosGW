import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const hourTable = pgTable('hour', {
  id: serial('id').primaryKey(),
  start: text('start').notNull(),
  finish: text('finish').notNull(),
  classNumber: integer('class_number').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})
