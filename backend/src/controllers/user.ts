import { insertUserSchema, userTable } from '../schemas/user'
import { FastifyReply, FastifyRequest } from 'fastify'
import getDB from '../functions/getDB'
import { eq, sql } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { z } from 'zod'

const PASSWORD_SALT_ROUNDS = 30

type UserInsert = typeof userTable.$inferInsert
const idValidator = z.coerce.number()

export class UserController {
  // TODO: protect this route
  async getAll (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { db, client } = await getDB()

    try {
      const repBody = await db.select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        type: userTable.type,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt
      }).from(userTable)

      rep.send(repBody)
    } catch (err) {
      rep.code(500)
      rep.send(err)
    } finally {
      await client.end()
    }

    return await rep
  }

  // TODO: protect this route
  async getOne (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string }
    let idInt: number = -1

    try {
      idInt = idValidator.parse(id)
    } catch (err: any) {
      rep.code(400)
      rep.send(JSON.parse(err))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const repBody = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          email: userTable.email,
          type: userTable.type,
          createdAt: userTable.createdAt,
          updatedAt: userTable.updatedAt
        })
        .from(userTable)
        .where(
          eq(userTable.id, idInt)
        )
        .limit(1)

      rep.send(repBody.length ? repBody[0] : {})
    } catch (err) {
      rep.code(500)
      rep.send(err)
    } finally {
      client.end()
    }

    return await rep
  }

  // TODO: make getOneByEmail route

  // TODO: protect this route
  async insertOne (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    let body: UserInsert

    try {
      body = insertUserSchema.parse(req.body)
    } catch (err: any) {
      rep.code(422)
      rep.send(JSON.parse(err))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const hashedPassword = await bcrypt.hash(body.password, PASSWORD_SALT_ROUNDS)
      body.password = hashedPassword

      const insertedUser = await db.insert(userTable).values(body).returning()
      rep.send(insertedUser)
    } catch (err) {
      rep.code(500)
      rep.send(err)
    } finally {
      client.end()
    }
    
    return await rep
  }

  // TODO: protect this route
  async updateOne (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string }
    let idInt: number = -1
    let body: UserInsert

    try {
      idInt = idValidator.parse(id)
    } catch (err: any) {
      rep.code(400)
      rep.send(JSON.parse(err))
      return await rep
    }

    try {
      body = insertUserSchema.parse(req.body)
    } catch (err: any) {
      rep.code(422)
      rep.send(JSON.parse(err))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      let updatedUser

      if (body.password) {
        const hashedPassword = await bcrypt.hash(body.password, PASSWORD_SALT_ROUNDS)
        body.password = hashedPassword

        updatedUser = await db.update(userTable).set({
          name: body.name,
          email: body.email,
          type: body.type,
          password: body.password,
          updatedAt: sql`NOW()`
        }).where(
          eq(userTable.id, idInt)
        ).returning()
      } else {
        updatedUser = await db.update(userTable).set({
          name: body.name,
          email: body.email,
          type: body.type,
          updatedAt: sql`NOW()`
        }).where(
          eq(userTable.id, idInt)
        )
      }


    } catch (err) {
      rep.code(500)
      rep.send(err)
    } finally {
      client.end()
    }

    return await rep
  }

  // TODO: protect this route
  async deleteOne (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string }
    let idInt: number = -1

    try {
      idInt = idValidator.parse(id)
    } catch (err: any) {
      rep.code(400)
      rep.send(JSON.parse(err))
      return await rep
    }

    const { db, client } = await getDB()
    
    try {
      const deletedUser = await db.delete(userTable).where(eq(userTable.id, idInt)).returning()
      rep.send(deletedUser)
    } catch (err) {
      rep.code(500)
      rep.send(err)
    } finally {
      client.end()
    }

    return await rep
  }

  async forgotPassword (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    return await rep
  }

  async login (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    return await rep
  }
}
