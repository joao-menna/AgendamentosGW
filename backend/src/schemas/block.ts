import { date, integer, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core'
import { hourTable } from './hour'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const blockTable = pgTable('block', {
  id: serial('id').notNull().primaryKey(),
  hourId: integer('hour_id').notNull().references(() => hourTable.id),
  date: date('date').notNull(),
  period: text('period', { enum: ['matutine', 'vespertine'] }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  uniqueBlock: unique('unique_block').on(table.hourId, table.date)
}))

export const selectBlockSchema = createSelectSchema(blockTable)
export const insertBlockSchema = createInsertSchema(blockTable)
