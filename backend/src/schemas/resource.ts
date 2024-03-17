import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const resourceTable = pgTable('resource', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})
