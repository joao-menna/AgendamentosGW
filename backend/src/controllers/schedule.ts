import { FastifyReply, FastifyRequest } from 'fastify'

export class ScheduleController {
  async getAll (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    return await rep
  }

  async getOne (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    return await rep
  }

  async insertOne (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    return await rep
  }

  async updateOne (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    return await rep
  }

  async deleteOne (req: FastifyRequest, rep: FastifyReply): Promise<FastifyReply> {
    return await rep
  }
}
