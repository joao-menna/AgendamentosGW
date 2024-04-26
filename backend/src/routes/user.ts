import { FastifyInstance } from 'fastify'
import { UserController } from '../controllers/user'

export default async function userRoutes (fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/v1/user', async (req, rep) => {
    const userController = new UserController()
    return await userController.getAll(req, rep)
  })

  fastify.get('/api/v1/user/email', async (req, rep) => {
    const userController = new UserController()
    return await userController.getOneByEmail(req, rep)
  })

  fastify.get('/api/v1/user/token/:token', async (req, rep) => {
    const userController = new UserController()
    return await userController.getOneByToken(req, rep)
  })

  fastify.get('/api/v1/user/:id', async (req, rep) => {
    const userController = new UserController()
    return await userController.getOne(req, rep)
  })

  fastify.post('/api/v1/user', async (req, rep) => {
    const userController = new UserController()
    return await userController.insertOne(req, rep)
  })

  fastify.put('/api/v1/user/:id', async (req, rep) => {
    const userController = new UserController()
    return await userController.updateOne(req, rep)
  })

  fastify.put('/api/v1/user/self', async (req, rep) => {
    const userController = new UserController()
    return await userController.updateSelf(req, rep)
  })

  fastify.delete('/api/v1/user/:id', async (req, rep) => {
    const userController = new UserController()
    return await userController.deleteOne(req, rep)
  })

  fastify.post('/api/v1/user/login', async (req, rep) => {
    const userController = new UserController()
    return await userController.login(req, rep)
  })
}
