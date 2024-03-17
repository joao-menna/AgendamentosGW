import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { userTable } from './user'

export const classTable = pgTable('class', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  period: text('period', { enum: ['matutine', 'vespertine'] }).notNull(),
  teacherId: integer('teacher_id').notNull().references(() => userTable.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})
