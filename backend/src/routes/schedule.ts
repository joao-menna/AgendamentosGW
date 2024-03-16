import { FastifyInstance } from 'fastify'
import { ScheduleController } from '../controllers/schedule'

export default async function schedule (fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/v1/schedule', async (req, rep) => {
    const scheduleController = new ScheduleController()
    return await scheduleController.getAll(req, rep)
  })

  fastify.get('/api/v1/schedule/:id', async (req, rep) => {
    const scheduleController = new ScheduleController()
    return await scheduleController.getOne(req, rep)
  })

  fastify.post('/api/v1/schedule', async (req, rep) => {
    const scheduleController = new ScheduleController()
    return await scheduleController.insertOne(req, rep)
  })

  fastify.put('/api/v1/schedule/:id', async (req, rep) => {
    const scheduleController = new ScheduleController()
    return await scheduleController.updateOne(req, rep)
  })

  fastify.delete('/api/v1/schedule/:id', async (req, rep) => {
    const scheduleController = new ScheduleController()
    return await scheduleController.deleteOne(req, rep)
  })
}
