import { HourController } from '../controllers/hour'
import { FastifyInstance } from 'fastify'

export default async function hourRoutes (fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/v1/hour', async (req, rep) => {
    const hourController = new HourController()
    return await hourController.getAll(req, rep)
  })

  fastify.post('/api/v1/hour', async (req, rep) => {
    const hourController = new HourController()
    return await hourController.insertAll(req, rep)
  })

  fastify.delete('/api/v1/hour', async (req, rep) => {
    const hourController = new HourController()
    return await hourController.deleteAll(req, rep)
  })
}
