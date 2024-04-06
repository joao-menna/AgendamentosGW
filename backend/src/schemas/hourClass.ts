import { date, integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { classResourceTable } from './classResource'
import { hourTable } from './hour'

export const hourClassTable = pgTable('hour_class', {
  id: serial('id').primaryKey(),
  hourId: integer('hour_id').notNull().references(() => hourTable.id),
  classResourceId: integer('class_resource_id').references(() => classResourceTable.id),
  date: date('date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})

export const selectHourClassSchema = createSelectSchema(hourClassTable)
export const insertHourClassSchema = createInsertSchema(hourClassTable)
