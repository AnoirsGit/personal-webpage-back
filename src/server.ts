import Fastify from 'fastify';
import fp from 'fastify-plugin';
import { config } from 'dotenv';
import ajvKeywords from 'ajv-keywords';
import formatsPlugin from 'ajv-formats';
import errorHandler from './plugins/errors.js';

import { envs } from './plugins/envs.js';

import {experience } from './features/experience/experience.js'


config({ path: `.env.${process.env.NODE_ENV}` });

export const build = async () => {
  const fastify = Fastify({
    logger: true,
    ajv: {
      customOptions: {
        //  When set to `true`, a DoS attack is possible https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/#validator-compiler
        allErrors: process.env.NODE_ENV !== 'production',
      },
      plugins: [
        //@ts-expect-error 2769
        [ajvKeywords, ['transform', 'instanceof']],
        //@ts-expect-error 2769
        [formatsPlugin, ['uri', 'email', 'date', 'date-time', 'iso-date-time']],
      ],
    },
  });

  await fastify.register(fp(envs));
  await fastify.register(fp(errorHandler));

  await fastify.register(experience);

  return fastify;
};
