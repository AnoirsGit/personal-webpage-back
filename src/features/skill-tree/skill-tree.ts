import { FastifyInstance } from 'fastify';
import { routes as skillTreeRoutes } from './router.js';

export async function application(fastify: FastifyInstance) {
  await fastify.register(skillTreeRoutes, { prefix: '/api/v1/applications' });
}
