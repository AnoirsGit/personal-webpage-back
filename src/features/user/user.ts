import { FastifyInstance } from 'fastify';
import { routes as userRoutes } from './router.js';

export async function application(fastify: FastifyInstance) {
  await fastify.register(userRoutes, { prefix: '/api/v1/applications' });
}
