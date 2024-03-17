import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const hourTable = pgTable('hour', {
  id: serial('id').primaryKey(),
  start: text('start').notNull(),
  finish: text('finish').notNull(),
  classNumber: integer('class_number').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})

export const selectHourSchema = createSelectSchema(hourTable)
export const insertHourSchema = createInsertSchema(hourTable)
