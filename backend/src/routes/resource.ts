import { FastifyInstance } from 'fastify'
import { ResourceController } from '../controllers/resource'

export default async function resourceRoutes (fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/v1/resource', async (req, rep) => {
    const resourceController = new ResourceController()
    return await resourceController.getAll(req, rep)
  })

  fastify.get('/api/v1/resource/:id', async (req, rep) => {
    const resourceController = new ResourceController()
    return await resourceController.getOne(req, rep)
  })

  fastify.post('/api/v1/resource', async (req, rep) => {
    const resourceController = new ResourceController()
    return await resourceController.insertOne(req, rep)
  })

  fastify.put('/api/v1/resource/:id', async (req, rep) => {
    const resourceController = new ResourceController()
    return await resourceController.updateOne(req, rep)
  })

  fastify.delete('/api/v1/resource/:id', async (req, rep) => {
    const resourceController = new ResourceController()
    return await resourceController.deleteOne(req, rep)
  })
}
