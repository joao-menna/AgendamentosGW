import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: 'drizzle',
  schema: './src/schemas/*',
  driver: 'pg',
  dbCredentials: {
    database: process.env.PGDATABASE ?? 'agendamentosgw',
    host: process.env.PGHOST ?? 'localhost',
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
  },
  verbose: true,
  strict: true
})
