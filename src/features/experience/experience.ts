import { FastifyInstance } from 'fastify';
import { routes as experienceRoutes } from './router.js';

export async function experience(fastify: FastifyInstance) {
  await fastify.register(experienceRoutes, { prefix: '/api/v1/experiences' });
}
