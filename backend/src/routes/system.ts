import { FastifyInstance } from 'fastify'
import { SystemController } from '../controllers/system'

export default async function systemRoutes (fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/v1/system/first-time', async (req, rep) => {
    const systemController = new SystemController()
    return await systemController.isFirstTime(req, rep)
  })

  fastify.post('/api/v1/system/first-time', async (req, rep) => {
    const systemController = new SystemController()
    return await systemController.systemFirstTime(req, rep)
  })
}
