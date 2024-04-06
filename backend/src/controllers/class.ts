import { classResourceTable, insertClassResourceSchema } from '../schemas/classResource'
import { classTable, insertClassSchema } from '../schemas/class'
import getUserFromToken from '../functions/getUserFromToken'
import { FastifyReply, FastifyRequest } from 'fastify'
import { resourceTable } from '../schemas/resource'
import { UNAUTHORIZED } from '../constants/tokens'
import { userTable } from '../schemas/user'
import { and, eq, sql } from 'drizzle-orm'
import getDB from '../functions/getDB'
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

    const { id } = req.params as { id: string }
    let idInt: number = -1

    try {
      idInt = idValidator.parse(id)
    } catch (err) {
      await rep.code(400).send(JSON.parse(err as string))
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

    try {
      const updatedClasses = await db.update(classTable).set({
        ...body,
        updatedAt: sql`NOW()`
      }).where(eq(classTable.id, idInt))
        .returning()

      await rep.send(updatedClasses[0])
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
    } catch (err) {
      await rep.code(400).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const deletedClasses = await db.delete(classTable).where(eq(classTable.id, idInt)).returning()

      if (deletedClasses.length > 0) {
        const deletedClass = deletedClasses[0]
        await rep.send(deletedClass)
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

  async getAllResource (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
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

    try {
      const resources = await db.select().from(classResourceTable)
        .innerJoin(resourceTable, eq(resourceTable.id, classResourceTable.resourceId))
        .where(eq(classResourceTable.classId, idInt))

      await rep.send(resources)
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    return await rep
  }

  async insertOneResource (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
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

    let body
    try {
      body = insertClassResourceSchema.parse(req.body)
    } catch (err) {
      await rep.code(400).send(JSON.parse(err as string))
      return await rep
    }

    if (idInt !== body.classId) {
      await rep.code(400).send({ message: 'invalid id' })
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const insertedResources = await db.insert(classResourceTable).values(body).returning()
      const insertedResource = insertedResources[0]

      await rep.send(insertedResource)
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    return await rep
  }

  async deleteOneResource (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
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

    const { id, resourceId } = req.params as { id: string, resourceId: string }
    let idInt
    let resourceIdInt
    try {
      idInt = idValidator.parse(id)
      resourceIdInt = idValidator.parse(resourceId)
    } catch (err) {
      await rep.code(400).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const deletedResources = await db.delete(classResourceTable)
        .where(
          and(
            eq(classResourceTable.classId, idInt),
            eq(classResourceTable.resourceId, resourceIdInt)
          )
        )
        .returning()

      if (deletedResources.length > 0) {
        await rep.send(deletedResources[0])
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
}
