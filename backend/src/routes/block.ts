import { FastifyInstance } from 'fastify'

export default async function blockRoutes (fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/v1/block', async (req, rep) => {
  })

  fastify.post('/api/v1/block', async (req, rep) => {
  })

  fastify.put('/api/v1/block/:id', async (req, rep) => {
  })

  fastify.delete('/api/v1/block/:id', async (req, rep) => {
  })
}
