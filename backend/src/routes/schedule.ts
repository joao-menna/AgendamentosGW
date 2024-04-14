import { FastifyInstance } from 'fastify'
import { ScheduleController } from '../controllers/schedule'

export default async function scheduleRoutes (fastify: FastifyInstance): Promise<void> {
  // Filters
  // ?userId=123
  // &resourceId=123
  // &classId=123
  // &minDate=9999-12-30
  // &maxDate=9999-12-30
  fastify.get('/api/v1/schedule', async (req, rep) => {
    const scheduleController = new ScheduleController()
    return await scheduleController.getAll(req, rep)
  })

  fastify.post('/api/v1/schedule', async (req, rep) => {
    const scheduleController = new ScheduleController()
    return await scheduleController.insertOne(req, rep)
  })

  fastify.delete('/api/v1/schedule/:id', async (req, rep) => {
    const scheduleController = new ScheduleController()
    return await scheduleController.deleteOne(req, rep)
  })
}
