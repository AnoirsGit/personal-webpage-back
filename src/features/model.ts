// TODO(smuravev) Transform `BaseQueryString` interface to `type`.
//  Then split it to two types: `SortedQuery` and `PaginatedQuery`.
//  This helps us to use it in the router handler, like:
//  `{ Querystring: SortedQuery & PaginatedQuery }`.
//  And as function arguments as well:

import { FastifyRequest } from 'fastify';

//  `myFunc(query: SortedQuery & PaginatedQuery & SearchingQuery)`.
export interface BaseQueryString {
  sortBy?: string;
  sortOrder?: string;
  pageNumber?: number;
  perPage?: number;
  searchQuery?: string;
}

// TODO(smuravev) Transform `BaseParams` to `type`. Then rename it to `Identifiable`.
//  The same reason as in the TODO above.
export interface BaseParams {
  id: number;
}

export interface QueryResult<Type> {
  data: Array<Type>;
  count: number;
}

export interface PagingResponse<Type> {
  data: Array<Type>;
  meta: ResponseMetadata;
}

export interface ResponseMetadata {
  page: Page;
}

export interface Page {
  pageNumber?: number;
  perPage?: number;
  total: number;
}

export const pagingMetaData = {
  type: 'object',
  properties: {
    page: {
      type: 'object',
      properties: {
        total: {type: 'number'}
      },
      required: ['total']
    },
  },
}


export interface SingleEntityResponse<Type> {
  data: Type;
}

export interface ArrayEntityResponse<Type> {
  data: Array<Type>;
}

export const paginationRequestSchema = {
  type: 'object',
  properties: {
    pageNumber: {
      type: 'integer',
      default: 0,
    },
    perPage: {
      type: 'integer',
      default: 10,
    },
    sortBy: {
      type: 'string',
    },
    sortOrder: {
      type: 'string',
    },
    searchQuery: {
      type: 'string',
    },
  },
};

export const paginationResponseSchema = {
  type: 'object',
  properties: {
    page: {
      type: 'object',
      properties: {
        pageNumber: {
          type: 'integer',
        },
        perPage: {
          type: 'integer',
        },
        total: {
          type: 'integer',
        },
      },
    },
  },
};

export type RequestBodyTeamId = FastifyRequest<{ Body: { teamId?: number | null } }>;
export type RequestQueryTeamId = FastifyRequest<{ Querystring: { teamId?: number } }>;
export type RequestQueryTeams = FastifyRequest<{ Querystring: { teams?: Array<number> } }>;
