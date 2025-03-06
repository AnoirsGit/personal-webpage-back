import { FastifyInstance, FastifyRequest } from 'fastify';
import { pagingMetaData } from '../model.js';

import {
  handleListExperiences,
  handleGetExperience,
  handleCreateExperience,
  handleUpdateExperience,
  handleDeleteExperience,
} from './controller.js';
import {
  createExperienceRequestSchema,
  updateExperienceRequestSchema,
  experienceItemResponseSchema,
  CreateExperienceRequest,
  UpdateExperienceRequest,
} from './model.js';

export async function routes(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '',
    handler: async (request: FastifyRequest) => handleListExperiences(fastify, request),
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            data: { type: 'array', items: experienceItemResponseSchema },
            meta: pagingMetaData
          },
        },
      },
    },
  });

  fastify.route({
    method: 'GET',
    url: '/:id',
    handler: async (request: FastifyRequest<{ Params: { id: number } }>) =>
      handleGetExperience(fastify, request),
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {type: 'number'}
        },
      },
      response: {
        200: {
          type: 'object',
          properties: { data: experienceItemResponseSchema },
        },
      },
    },
  });

  fastify.route({
    method: 'POST',
    url: '',
    handler: async (request: FastifyRequest<{ Body: CreateExperienceRequest }>) =>
      handleCreateExperience(fastify, request),
    schema: {
      body: createExperienceRequestSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            data: experienceItemResponseSchema,
          },
        },
      },
    },
  });

  fastify.route({
    method: 'PATCH',
    url: '/:id',
    handler: async ( 
      request: FastifyRequest<{ Params: { id: number }; Body: UpdateExperienceRequest }>
    ) => handleUpdateExperience(fastify, request),
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {type: 'number'}
        },
      },
      body: updateExperienceRequestSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            data: experienceItemResponseSchema,
          },
        },
      },
    },
  });

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    handler: async (request: FastifyRequest<{ Params: { id: number } }>) =>
      handleDeleteExperience(fastify, request),
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {type: 'number'}
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: {type: 'string'}
          },
        },
      },
    },
  });
}
