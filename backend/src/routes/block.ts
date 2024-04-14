import { FastifyInstance } from 'fastify'
import { BlockController } from '../controllers/block'

export default async function blockRoutes (fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/v1/block', async (req, rep) => {
    const blockController = new BlockController()
    return await blockController.getAll(req, rep)
  })

  fastify.post('/api/v1/block', async (req, rep) => {
    const blockController = new BlockController()
    return await blockController.insertOne(req, rep)
  })

  fastify.delete('/api/v1/block/:id', async (req, rep) => {
    const blockController = new BlockController()
    return await blockController.deleteOne(req, rep)
  })
}
