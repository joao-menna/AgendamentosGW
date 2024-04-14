import { classResourceTable } from '../schemas/classResource'
import getUserFromToken from '../functions/getUserFromToken'
import { FastifyReply, FastifyRequest } from 'fastify'
import { hourClassTable, insertHourClassSchema } from '../schemas/hourClass'
import { classTable } from '../schemas/class'
import { and, eq, gte, lte } from 'drizzle-orm'
import getDB from '../functions/getDB'
import { z } from 'zod'

interface ScheduleFilters {
  userId?: string
  resourceId?: string
  classId?: string
  minDate?: string
  maxDate?: string
}

const numberValidator = z.coerce.number()
const dateValidator = z.coerce.date()

export class ScheduleController {
  // Filters
  // ?userId=123
  // &resourceId=123
  // &classId=123
  // &minDate=9999-12-30
  // &maxDate=9999-12-30
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

    const { userId, resourceId, classId, minDate, maxDate } = req.query as ScheduleFilters
    const filters = []

    try {
      if (userId !== undefined) {
        const userIdInt = numberValidator.parse(userId)
        filters.push(eq(classTable.teacherId, userIdInt))
      }

      if (resourceId !== undefined) {
        const resourceIdInt = numberValidator.parse(resourceId)
        filters.push(eq(classResourceTable.resourceId, resourceIdInt))
      }

      if (classId !== undefined) {
        const classIdInt = numberValidator.parse(classId)
        filters.push(eq(classTable.id, classIdInt))
      }

      if (minDate !== undefined) {
        const minDateInDate = dateValidator.parse(minDate)
        const onlyDate = minDateInDate.toISOString().split('T')[0]
        filters.push(gte(hourClassTable.date, onlyDate))
      }

      if (maxDate !== undefined) {
        const maxDateInDate = dateValidator.parse(maxDate)
        const onlyDate = maxDateInDate.toISOString().split('T')[0]
        filters.push(lte(hourClassTable.date, onlyDate))
      }
    } catch (err) {
      await rep.code(400).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const schedules = await db
        .select()
        .from(hourClassTable)
        .innerJoin(classResourceTable, eq(hourClassTable.classResourceId, classResourceTable.id))
        .innerJoin(classTable, eq(classTable.id, classResourceTable.classId))
        .where(and(...filters))
      await rep.send(schedules)
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    return await rep
  }

  async insertOne (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    const { authorization } = req.headers

    try {
      await getUserFromToken(authorization ?? '')
    } catch (err: any) {
      await rep.code(401).send({
        message: err.message
      })
      return await rep
    }

    let body
    try {
      body = insertHourClassSchema.parse(req.body)
    } catch (err) {
      await rep.code(500).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      const schedules = await db
        .select()
        .from(hourClassTable)
        .innerJoin(classResourceTable, eq(hourClassTable.classResourceId, classResourceTable.id))
        .innerJoin(classTable, eq(classTable.id, classResourceTable.classId))
        .where(
          and(
            eq(hourClassTable.date, body.date),
            eq(hourClassTable.hourId, body.hourId)
          )
        )

      const bodyResources = await db
        .select()
        .from(classResourceTable)
        .innerJoin(classTable, eq(classTable.id, classResourceTable.classId))
        .where(eq(classResourceTable.id, body.classResourceId))

      const bodyResource = bodyResources[0]

      let isValid = true
      for (const schedule of schedules) {
        if (
          schedule.class_resource.resourceId === bodyResource.class_resource.resourceId &&
          schedule.class.period === bodyResource.class.period
        ) {
          isValid = false
        }
      }

      if (isValid) {
        const inserts = await db.insert(hourClassTable).values(body).returning()
        await rep.send(inserts.length > 0 ? inserts[0] : {})
      } else {
        await rep.code(400).send({
          message: 'resource already scheduled'
        })
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
    const isAdmin = allowedTypes.includes(userAuth.type)

    const { id } = req.params as { id: string }

    let idInt
    try {
      idInt = numberValidator.parse(id)
    } catch (err) {
      await rep.code(400).send(JSON.parse(err as string))
      return await rep
    }

    const { db, client } = await getDB()

    try {
      let canDelete = true
      if (!isAdmin) {
        const selects = await db
          .select()
          .from(hourClassTable)
          .innerJoin(classResourceTable, eq(classResourceTable.id, hourClassTable.classResourceId))
          .innerJoin(classTable, eq(classTable.id, classResourceTable.resourceId))
          .where(eq(hourClassTable.id, idInt))

        const select = selects[0]

        if (select.class.teacherId !== userAuth.id) {
          canDelete = false
        }
      }

      if (canDelete) {
        await db
          .delete(hourClassTable)
          .where(eq(hourClassTable.id, idInt))

        await rep.send({
          message: 'deleted'
        })
      } else {
        await rep.send({
          message: 'not deleted'
        })
      }
    } catch (err) {
      await rep.code(500).send(err)
    } finally {
      await client.end()
    }

    return await rep
  }
}
