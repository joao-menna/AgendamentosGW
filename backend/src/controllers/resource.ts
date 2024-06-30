import { FastifyReply, FastifyRequest } from 'fastify'
import getDB from '../functions/getDB'
import getUserFromToken from '../functions/getUserFromToken'
import { UNAUTHORIZED } from '../constants/tokens'
import { insertResourceSchema, resourceTable } from '../schemas/resource'
import { z } from 'zod'
import { eq } from 'drizzle-orm'

const idValidator = z.coerce.number()

export class ResourceController {
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

    const allowedTypes = ['owner', 'admin', 'common']
    if (!allowedTypes.includes(userAuth.type)) {
      await rep.code(401).send({
        message: UNAUTHORIZED
      })
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const resources = await db.select().from(resourceTable)
      await rep.send(resources)
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

    const allowedTypes = ['owner', 'admin', 'common']
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
      const resources = await db.select().from(resourceTable).where(eq(resourceTable.id, idInt))
      await rep.send(resources.length > 0 ? resources[0] : {})
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
      body = insertResourceSchema.parse(req.body)
    } catch (err) {
      await rep.code(500).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const insertedResources = await db.insert(resourceTable).values(body).returning()
      await rep.send(insertedResources.length > 0 ? insertedResources[0] : {})
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

    let idInt
    try {
      idInt = idValidator.parse(id)
    } catch (err) {
      await rep.code(400).send(JSON.parse(err as string))
      return await rep
    }

    let body
    try {
      body = insertResourceSchema.parse(req.body)
    } catch (err) {
      await rep.code(500).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const updatedResources = await db.update(resourceTable).set(body)
        .where(eq(resourceTable.id, idInt))
        .returning()

      await rep.send(updatedResources.length > 0 ? updatedResources[0] : {})
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

    let idInt
    try {
      idInt = idValidator.parse(id)
    } catch (err) {
      await rep.code(400).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const deletedResources = await db.delete(resourceTable)
        .where(eq(resourceTable.id, idInt))
        .returning()

      await rep.send(deletedResources.length > 0 ? deletedResources[0] : {})
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    return await rep
  }
}
