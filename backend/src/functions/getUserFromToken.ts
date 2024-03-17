import { INEXISTENT_USER } from '../constants/passwords'
import { INVALID_TOKEN } from '../constants/tokens'
import { userTable } from '../schemas/user'
import verifyJWT from './verifyJWT'
import getDB from './getDB'
import { eq } from 'drizzle-orm'

export default async function getUserFromToken (
  token: string
): Promise<typeof userTable.$inferSelect> {
  const payload = await verifyJWT(token ?? '')
  if (payload === undefined) {
    throw new Error(INVALID_TOKEN)
  }

  const { db, client } = await getDB()

  const users = await db.select().from(userTable).where(eq(userTable.id, payload.id as number))
  await client.end()

  if (users.length === 0) {
    throw new Error(INEXISTENT_USER)
  }

  return users[0]
}
