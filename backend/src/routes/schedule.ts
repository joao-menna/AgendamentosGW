import { FastifyInstance } from 'fastify'

export default async function schedule (fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/v1/schedule', async (req, rep) => {
  })

  fastify.get('/api/v1/schedule/:id', async (req, rep) => {
  })

  fastify.post('/api/v1/schedule', async (req, rep) => {
  })

  fastify.put('/api/v1/schedule/:id', async (req, rep) => {
  })

  fastify.delete('/api/v1/schedule/:id', async (req, rep) => {
  })
}
