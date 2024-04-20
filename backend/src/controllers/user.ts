import { insertUserSchema, loginUserSchema, selectUserSchema, updateUserSchema, userTable } from '../schemas/user'
import { EMAIL_EXISTENT, INEXISTENT_USER, PASSWORD_SALT_ROUNDS, WRONG_PASSWORD } from '../constants/passwords'
import getUserFromToken from '../functions/getUserFromToken'
import { FastifyReply, FastifyRequest } from 'fastify'
import { UNAUTHORIZED } from '../constants/tokens'
import getDB from '../functions/getDB'
import { eq, sql } from 'drizzle-orm'
import { sign } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { z } from 'zod'

type UserInsert = typeof userTable.$inferInsert
type UserUpdate = z.infer<typeof updateUserSchema>
const idValidator = z.coerce.number()
const emailValidator = z.string().email()

export class UserController {
  async getAll (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { authorization } = req.headers

    let userAuth
    try {
      userAuth = await getUserFromToken(authorization ?? '')
    } catch (err: any) {
      await rep.code(401).send({
        message: err.message
      })
      return await rep
    }

    const allowedTypes = ['owner', 'admin']
    if (!allowedTypes.includes(userAuth.type)) {
      await rep.code(401).send({
        message: UNAUTHORIZED
      })
      return await rep
    }

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

      await rep.send(repBody)
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    return await rep
  }

  async getOne (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { authorization } = req.headers

    let userAuth
    try {
      userAuth = await getUserFromToken(authorization ?? '')
    } catch (err: any) {
      await rep.code(401).send({
        message: err.message
      })
      return await rep
    }

    const allowedTypes = ['owner', 'admin']
    if (!allowedTypes.includes(userAuth.type)) {
      await rep.code(401).send({
        message: UNAUTHORIZED
      })
      return await rep
    }

    const { id } = req.params as { id: string }
    let idInt: number = -1

    try {
      idInt = idValidator.parse(id)
    } catch (err: any) {
      await rep.code(400).send(JSON.parse(err as string))
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

      await rep.send(repBody.length > 0 ? repBody[0] : {})
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    return await rep
  }

  async getOneByEmail (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { authorization } = req.headers

    let userAuth
    try {
      userAuth = await getUserFromToken(authorization ?? '')
    } catch (err: any) {
      await rep.code(401).send({
        message: err.message
      })
      return await rep
    }

    const allowedTypes = ['owner', 'admin']
    if (!allowedTypes.includes(userAuth.type)) {
      await rep.code(401).send({
        message: UNAUTHORIZED
      })
      return await rep
    }

    const { email } = req.query as { email: string }
    let parsedEmail = ''

    try {
      parsedEmail = emailValidator.parse(email)
    } catch (err) {
      await rep.code(400).send(JSON.parse(err as string))
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
          eq(userTable.email, parsedEmail)
        )
        .limit(1)

      await rep.send(repBody.length > 0 ? repBody[0] : {})
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    return await rep
  }

  async insertOne (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { authorization } = req.headers

    let userAuth
    try {
      userAuth = await getUserFromToken(authorization ?? '')
    } catch (err: any) {
      await rep.code(401).send({
        message: err.message
      })
      return await rep
    }

    const allowedTypes = ['owner', 'admin']
    if (!allowedTypes.includes(userAuth.type)) {
      await rep.code(401).send({
        message: UNAUTHORIZED
      })
      return await rep
    }

    let body: UserInsert

    try {
      body = insertUserSchema.parse(req.body)
    } catch (err: any) {
      await rep.code(422).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const hashedPassword = bcrypt.hashSync(body.password, PASSWORD_SALT_ROUNDS)
      body.password = hashedPassword

      const insertedUser = await db
        .insert(userTable)
        .values(body)
        .onConflictDoNothing({ target: userTable.email })
        .returning()

      if (insertedUser.length === 0) {
        await rep.code(400).send({
          message: EMAIL_EXISTENT
        })
        return await rep
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

  async updateOne (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { authorization } = req.headers

    let userAuth
    try {
      userAuth = await getUserFromToken(authorization ?? '')
    } catch (err: any) {
      await rep.code(401).send({
        message: err.message
      })
      return await rep
    }

    const allowedTypes = ['owner', 'admin']
    if (!allowedTypes.includes(userAuth.type)) {
      await rep.code(401).send({
        message: UNAUTHORIZED
      })
      return await rep
    }

    const { id } = req.params as { id: string }
    let idInt: number = -1
    let body: UserUpdate

    try {
      idInt = idValidator.parse(id)
    } catch (err: any) {
      await rep.code(400).send(JSON.parse(err as string))
      return await rep
    }

    try {
      body = updateUserSchema.parse(req.body)
    } catch (err: any) {
      await rep.code(422).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      let updatedUser

      if (body.password !== undefined) {
        if (body.password.length === 0) {
          throw new Error('Invalid password')
        }

        const hashedPassword = bcrypt.hashSync(body.password, PASSWORD_SALT_ROUNDS)
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
        ).returning()
      }

      if (updatedUser.length > 0) {
        // Removing password hash from updatedUser to send
        const sendUser = {
          id: updatedUser[0].id,
          name: updatedUser[0].name,
          email: updatedUser[0].email,
          type: updatedUser[0].type,
          createdAt: updatedUser[0].createdAt,
          updatedAt: updatedUser[0].updatedAt
        }

        await rep.send(sendUser)
      } else {
        await rep.send({})
      }
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    return await rep
  }

  async updateSelf (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { authorization } = req.headers

    let userAuth
    try {
      userAuth = await getUserFromToken(authorization ?? '')
    } catch (err: any) {
      await rep.code(401).send({
        message: err.message
      })
      return await rep
    }

    let body
    try {
      body = insertUserSchema.parse(req.body)
    } catch (err: any) {
      await rep.code(422).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      let updatedUser

      if (body.password !== undefined) {
        if (body.password.length === 0) {
          throw new Error('Invalid password')
        }

        const hashedPassword = bcrypt.hashSync(body.password, PASSWORD_SALT_ROUNDS)
        body.password = hashedPassword

        updatedUser = await db.update(userTable).set({
          name: body.name,
          email: body.email,
          type: body.type,
          password: body.password,
          updatedAt: sql`NOW()`
        }).where(
          eq(userTable.id, userAuth.id)
        ).returning()
      } else {
        updatedUser = await db.update(userTable).set({
          name: body.name,
          email: body.email,
          type: body.type,
          updatedAt: sql`NOW()`
        }).where(
          eq(userTable.id, userAuth.id)
        ).returning()
      }

      if (updatedUser.length > 0) {
        // Removing password hash from updatedUser to send
        const sendUser = {
          id: updatedUser[0].id,
          name: updatedUser[0].name,
          email: updatedUser[0].email,
          type: updatedUser[0].type,
          createdAt: updatedUser[0].createdAt,
          updatedAt: updatedUser[0].name
        }

        await rep.send(sendUser)
      } else {
        await rep.send({})
      }
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    return await rep
  }

  async deleteOne (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { authorization } = req.headers

    let userAuth
    try {
      userAuth = await getUserFromToken(authorization ?? '')
    } catch (err: any) {
      await rep.code(401).send({
        message: err.message
      })
      return await rep
    }

    const allowedTypes = ['owner', 'admin']
    if (!allowedTypes.includes(userAuth.type)) {
      await rep.code(401).send({
        message: UNAUTHORIZED
      })
      return await rep
    }

    const { id } = req.params as { id: string }
    let idInt: number = -1

    try {
      idInt = idValidator.parse(id)
    } catch (err: any) {
      await rep.code(400).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const deletedUser = await db.delete(userTable).where(eq(userTable.id, idInt)).returning()

      if (deletedUser.length > 0) {
        const sendUser = {
          id: deletedUser[0].id,
          name: deletedUser[0].name,
          email: deletedUser[0].email,
          type: deletedUser[0].type,
          createdAt: deletedUser[0].createdAt,
          updatedAt: deletedUser[0].updatedAt
        }

        await rep.send(sendUser)
      } else {
        await rep.send({})
      }
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    return await rep
  }

  async login (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    // const { token } = req.body as { token?: string }

    // if (token === undefined || token !== process.env.FIRST_TIME_TOKEN) {
    //   await rep.code(401).send({
    //     message: 'Unauthorized'
    //   })
    //   return await rep
    // }

    let body: z.infer<typeof loginUserSchema> | undefined

    try {
      body = loginUserSchema.parse(req.body)
    } catch (err) {
      await rep.code(422).send(JSON.stringify(err))
      return await rep
    }

    const { db, client } = await getDB()

    let user: z.infer<typeof selectUserSchema>

    try {
      const users = await db.select().from(userTable).where(eq(userTable.email, body.email))
      if (users.length === 0) {
        await client.end()
        await rep.code(400).send({
          message: INEXISTENT_USER
        })
        return await rep
      }

      user = users[0]
    } catch (err) {
      await rep.code(500).send(err)
      return await rep
    } finally {
      await client.end()
    }

    const isRightPassword = await bcrypt.compare(body.password, user.password)
    if (!isRightPassword) {
      await rep.code(401).send({
        message: WRONG_PASSWORD
      })
      return await rep
    }

    const tokenJwt = sign(
      {
        id: user.id,
        iat: new Date().getTime() / 1000
      },
      process.env.JWT_PRIVATE_KEY ?? 'fixed key',
      {
        expiresIn: '24h'
      }
    )

    await rep.send({
      token: tokenJwt
    })

    return await rep
  }
}
