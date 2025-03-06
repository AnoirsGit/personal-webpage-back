import { FastifyInstance } from 'fastify';
import { fastifyEnv } from '@fastify/env';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  type: 'object',
  required: [
    'PORT',
    'HOST',
    'PG_USER',
    'PG_PASSWORD',
    'PG_HOST',
    'PG_DATABASE',
    'PG_PORT',
    'PG_DATABASE_POOL_SIZE',
   
  ],
  properties: {
    PORT: { type: 'integer' },
    HOST: { type: 'string' },
    PG_USER: { type: 'string' },
    PG_PASSWORD: { type: 'string' },
    PG_HOST: { type: 'string' },
    PG_DATABASE: { type: 'string' },
    PG_PORT: { type: 'integer' },
    PG_DATABASE_POOL_SIZE: { type: 'string' },
  },
} as const;

export type Envs = FromSchema<typeof schema>;

export const envs = async (fastify: FastifyInstance) => {
  // Fastify-env: https://github.com/fastify/fastify-env
  fastify.register(fastifyEnv, { schema, dotenv: true }).ready(err => {
    if (err) console.error(err);
  });
};
