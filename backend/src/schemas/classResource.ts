import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core'
import { classTable } from './class'
import { resourceTable } from './resource'

export const classResourceTable = pgTable('class_resource', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').notNull().references(() => classTable.id),
  resourceId: integer('resource_id').notNull().references(() => resourceTable.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})
