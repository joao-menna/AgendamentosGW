import { FastifyInstance } from 'fastify'

export default async function user (fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/v1/user', async (req, rep) => {
  })

  fastify.get('/api/v1/user/:id', async (req, rep) => {
  })

  fastify.post('/api/v1/user', async (req, rep) => {
  })

  fastify.put('/api/v1/user/:id', async (req, rep) => {
  })

  fastify.delete('/api/v1/user/:id', async (req, rep) => {
  })
}
