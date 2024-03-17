import { PASSWORD_SALT_ROUNDS } from '../constants/passwords'
import { insertUserSchema, userTable } from '../schemas/user'
import { FastifyReply, FastifyRequest } from 'fastify'
import getDB from '../functions/getDB'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'

export class SystemController {
  async isFirstTime (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { db, client } = await getDB()

    let owner: typeof userTable.$inferSelect | undefined

    try {
      const owners = await db.select().from(userTable).where(eq(userTable.type, 'owner'))
      owner = owners.length > 0 ? owners[0] : undefined
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    let isFirstTime = false
    if (owner !== undefined) {
      isFirstTime = owner.password === ''

      const sendOwner = {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        type: owner.type,
        createdAt: owner.createdAt,
        updatedAt: owner.updatedAt
      }

      await rep.send({
        firstTime: isFirstTime,
        ...sendOwner
      })
    } else {
      isFirstTime = true
      await rep.send({
        firstTime: isFirstTime
      })
    }

    return await rep
  }

  async systemFirstTime (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { token } = req.body as { token?: string }

    if (token === undefined || token !== process.env.FIRST_TIME_TOKEN) {
      await rep.code(401).send({
        message: 'Unauthorized'
      })
      return await rep
    }

    let body
    try {
      body = insertUserSchema.parse(req.body)
    } catch (err) {
      await rep.code(422).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const hashedPassword = bcrypt.hashSync(body.password, PASSWORD_SALT_ROUNDS)
      body.password = hashedPassword

      const users = await db.select().from(userTable).where(eq(userTable.email, body.email))
      let insertedUser

      if (users.length > 0) {
        insertedUser = await db
          .update(userTable)
          .set({
            name: body.name,
            email: body.email,
            password: body.password
          })
          .where(eq(userTable.id, users[0].id))
          .returning()
      } else {
        insertedUser = await db.insert(userTable).values({
          ...body,
          type: 'owner'
        }).returning()
      }

      // Removing password hash from insertedUser to send
      const sendUser = {
        id: insertedUser[0].id,
        name: insertedUser[0].name,
        email: insertedUser[0].email,
        type: insertedUser[0].type,
        createdAt: insertedUser[0].createdAt,
        updatedAt: insertedUser[0].name
      }

      await rep.send(sendUser)
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    return await rep
  }
}
