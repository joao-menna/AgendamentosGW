import { FastifyReply, FastifyRequest } from 'fastify'
import getUserFromToken from '../functions/getUserFromToken'
import { UNAUTHORIZED } from '../constants/tokens'
import getDB from '../functions/getDB'
import { blockTable, insertBlockSchema } from '../schemas/block'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const idValidator = z.coerce.number()

export class BlockController {
  async getAll (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { authorization } = req.headers

    try {
      await getUserFromToken(authorization ?? '')
    } catch (err: any) {
      await rep.code(401).send({
        message: err.message
      })
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const blocks = await db.select().from(blockTable)
      await rep.send(blocks)
    } catch (err) {
      await rep.status(500).send(err)
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
      body = insertBlockSchema.parse(req.body)
    } catch (err) {
      await rep.code(400).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const inserts = await db.insert(blockTable).values(body).returning()
      await rep.send(inserts.length > 0 ? inserts[0] : {})
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
      const deletes = await db.delete(blockTable).where(eq(blockTable.id, idInt)).returning()
      await rep.send(deletes.length > 0 ? deletes[0] : {})
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    return await rep
  }
}
