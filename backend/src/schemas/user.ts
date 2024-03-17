import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const userTable = pgTable('user', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  type: text('type', { enum: ['owner', 'admin', 'common'] }).notNull().default('common'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})

export const insertUserSchema = createInsertSchema(userTable)

export const updateUserSchema = createInsertSchema(userTable, {
  password: z.string().optional()
})

export const loginUserSchema = createInsertSchema(userTable, {
  name: z.string().optional(),
  email: z.string().email()
})

export const selectUserSchema = createInsertSchema(userTable)
