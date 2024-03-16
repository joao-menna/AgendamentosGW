import { fastifyAutoload } from '@fastify/autoload'
import { fastifyCors } from '@fastify/cors'
import { fastifyStatic } from '@fastify/static'
import { FastifyInstance, fastify } from 'fastify'
import { resolve } from 'path'

export default async function getServer (): Promise<FastifyInstance> {
  const server = fastify({
    logger: process.env.LOGGER === 'true'
  })

  await server.register(fastifyCors, {
    origin: '*'
  })

  await server.register(fastifyAutoload, {
    dir: resolve(__dirname, '..', 'routes'),
    dirNameRoutePrefix: false
  })

  await server.register(fastifyStatic, {
    root: resolve(__dirname, '..', '..', 'static')
  })

  await server.ready()

  return await server
}
