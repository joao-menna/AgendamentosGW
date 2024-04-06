import { date, integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core'
import { hourTable } from './hour'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const blockTable = pgTable('block', {
  id: serial('id').notNull().primaryKey(),
  hourId: integer('hour_id').notNull().references(() => hourTable.id),
  date: date('date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})

export const blockSelectSchema = createSelectSchema(blockTable)
export const blockInsertSchema = createInsertSchema(blockTable)
