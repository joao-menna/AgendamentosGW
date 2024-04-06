import { FastifyInstance } from 'fastify'
import { ClassController } from '../controllers/class'

export default async function classRoutes (fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/v1/class', async (req, rep) => {
    const classController = new ClassController()
    return await classController.getAll(req, rep)
  })

  fastify.get('/api/v1/class/:id', async (req, rep) => {
    const classController = new ClassController()
    return await classController.getOne(req, rep)
  })

  fastify.post('/api/v1/class', async (req, rep) => {
    const classController = new ClassController()
    return await classController.insertOne(req, rep)
  })

  fastify.put('/api/v1/class/:id', async (req, rep) => {
    const classController = new ClassController()
    return await classController.updateOne(req, rep)
  })

  fastify.delete('/api/v1/class/:id', async (req, rep) => {
    const classController = new ClassController()
    return await classController.deleteOne(req, rep)
  })

  fastify.get('/api/v1/class/:id/resource', async (req, rep) => {
    const classController = new ClassController()
    return await classController.getAllResource(req, rep)
  })

  fastify.post('/api/v1/class/:id/resource', async (req, rep) => {
    const classController = new ClassController()
    return await classController.insertOneResource(req, rep)
  })

  fastify.delete('/api/v1/class/:id/resource/:resourceId', async (req, rep) => {
    const classController = new ClassController()
    return await classController.deleteOneResource(req, rep)
  })
}
