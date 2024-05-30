import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: 'drizzle',
  schema: './src/schemas/*',
  driver: 'pg',
  dbCredentials: {
    database: process.env.PGDATABASE ?? 'agendamentosgw',
    host: process.env.PGHOST ?? 'localhost',
    user: process.env.PGUSER ?? 'postgres',
    password: process.env.PGPASSWORD ?? 'root'
  },
  verbose: true,
  strict: true
})
