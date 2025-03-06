import { FastifyInstance, FastifyRequest } from 'fastify';
import { PagingResponse, SingleEntityResponse, BaseParams, BaseQueryString } from '../model.js';
import {
  ExperienceItemResponse,
  CreateExperienceRequest,
  UpdateExperienceRequest,
} from './model.js';
import {create, deleteOneById, findAll, findOneById, update }  from './repository.js';

export const handleListExperiences = async (
  fastify: FastifyInstance,
  request: FastifyRequest
): Promise<PagingResponse<ExperienceItemResponse>> => {
  const result = await findAll();
  
  return {
    data: result.data, 
    meta: { page: { total: result.count }},
  };
};

export const handleGetExperience = async (
  fastify: FastifyInstance,
  request: FastifyRequest<{ Params: BaseParams }>
): Promise<SingleEntityResponse<ExperienceItemResponse>> => {
  const experience = await findOneById({ id: request.params.id });
  if (!experience) {
    throw new Error('Experience not found');
  }
  return { data: experience };
};

export const handleCreateExperience = async (
  fastify: FastifyInstance,
  request: FastifyRequest<{ Body: CreateExperienceRequest }>
): Promise<SingleEntityResponse<ExperienceItemResponse>> => {
  const experience = await create(request.body);
  return { data: experience };
};

export const handleUpdateExperience = async (
  fastify: FastifyInstance,
  request: FastifyRequest<{ Params: BaseParams; Body: UpdateExperienceRequest }>
): Promise<SingleEntityResponse<ExperienceItemResponse>> => {
  const experience = await update({ id: request.params.id, ...request.body });
  if (!experience) {
    throw new Error('Experience not found');
  }
  return { data: experience };
};

export const handleDeleteExperience = async (
  fastify: FastifyInstance,
  request: FastifyRequest<{ Params: BaseParams }>
): Promise<{ message: string }> => {
  const numDeleted = await deleteOneById({ id: request.params.id });
  if (!numDeleted) {
    throw new Error('Experience not found or could not be deleted');
  }
  return { message: 'Experience deleted successfully' };
};
