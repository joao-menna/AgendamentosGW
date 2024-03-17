import { migrate } from 'drizzle-orm/node-postgres/migrator'
import getDB from '../functions/getDB'
import { config } from 'dotenv'
import { resolve } from 'path'

config()

async function main (): Promise<void> {
  const db = await getDB()
  await migrate(db, { migrationsFolder: resolve(__dirname, '..', '..', 'drizzle') })
}

main()
  .then(() => {
    console.log('Database migrated successfully.')
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
