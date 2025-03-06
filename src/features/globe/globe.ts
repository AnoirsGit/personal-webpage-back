import { FastifyInstance } from 'fastify';
import { routes as globeRoutes } from './router.js';

export async function application(fastify: FastifyInstance) {
  await fastify.register(globeRoutes, { prefix: '/api/v1/applications' });
}
