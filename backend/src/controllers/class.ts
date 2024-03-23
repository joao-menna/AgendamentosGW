import getUserFromToken from '../functions/getUserFromToken'
import { FastifyReply, FastifyRequest } from 'fastify'
import { UNAUTHORIZED } from '../constants/tokens'
import getDB from '../functions/getDB'
import { classTable, insertClassSchema } from '../schemas/class'
import { userTable } from '../schemas/user'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const idValidator = z.coerce.number()

export class ClassController {
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

    let fullClass
    try {
      fullClass = await db
        .select()
        .from(classTable)
        .innerJoin(userTable, eq(userTable.id, classTable.teacherId))
      await rep.send(fullClass)
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
    let idInt
    try {
      idInt = idValidator.parse(id)
    } catch (err) {
      await rep.code(400).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    let fullClass
    try {
      fullClass = await db
        .select()
        .from(classTable)
        .innerJoin(userTable, eq(userTable.id, classTable.teacherId))
        .where(eq(classTable.id, idInt))

      await rep.send(fullClass.length > 0 ? fullClass[0] : {})
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

    let body
    try {
      body = insertClassSchema.parse(req.body)
    } catch (err) {
      await rep.code(400).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    let insertedClass
    try {
      insertedClass = await db.insert(classTable).values(body).returning()
      await rep.send(insertedClass)
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

    const { db, client } = await getDB()

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

    const { db, client } = await getDB()

    return await rep
  }
}
