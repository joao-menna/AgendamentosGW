import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

async function sendDefaultMessage (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
  await rep.send({
    message: 'Server running'
  })

  return await rep
}

export default async function indexRoutes (fastify: FastifyInstance): Promise<void> {
  fastify.get('/', sendDefaultMessage)
  fastify.get('/api', sendDefaultMessage)
  fastify.get('/api/v1', sendDefaultMessage)
}
