import getUserFromToken from '../functions/getUserFromToken'
import { FastifyReply, FastifyRequest } from 'fastify'
import { hourTable } from '../schemas/hour'
import getDB from '../functions/getDB'
import { UNAUTHORIZED } from '../constants/tokens'

export class HourController {
  async getAll (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { db, client } = await getDB()

    try {
      const hours = await db.select().from(hourTable)
      await rep.send(hours)
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    return await rep
  }

  async insertAll (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
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

    const hours = [
      {
        classNumber: 1,
        start: '07:30',
        finish: '08:15'
      },
      {
        classNumber: 2,
        start: '08:15',
        finish: '09:00'
      },
      {
        classNumber: 3,
        start: '09:00',
        finish: '09:45'
      },
      {
        classNumber: 4,
        start: '10:00',
        finish: '10:45'
      },
      {
        classNumber: 5,
        start: '10:45',
        finish: '11:45'
      }
    ]

    const { db, client } = await getDB()

    try {
      await db.insert(hourTable).values(hours)
    } catch (err) {
    } finally {
      await client.end()
    }

    return await rep
  }

  async deleteAll (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
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
      await db.delete(hourTable)
      await rep.send()
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    return await rep
  }
}
