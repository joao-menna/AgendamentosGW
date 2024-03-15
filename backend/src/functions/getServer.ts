import { fastifyCors } from '@fastify/cors'
import { FastifyInstance, fastify } from 'fastify'

export default async function getServer (): Promise<FastifyInstance> {
  const server = fastify({
    logger: process.env.LOGGER === 'true'
  })

  await server.register(fastifyCors, {
    origin: '*'
  })

  return await server
}
