import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { FastifySchemaValidationError } from 'fastify/types/schema.js';

type ErrorDto = {
  status: number;
  title: string;
  detail: string;
  source?: {
    pointer: string;
  };
  code?: string;
  stack?: string;
};

class AppError extends Error implements FastifyError {
  public statusCode: number;
  public code: string;
  public name: string;
  public message: string;
  public validation?: FastifySchemaValidationError[];

  constructor(
    name: string = 'AppError',
    statusCode: number,
    code: string,
    message: string,
    validation?: FastifySchemaValidationError[],
  ) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.validation = validation;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * 401 - Unauthorized (auth failed, no token, session expired, user disabled, etc.)
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', code?: string) {
    const name = 'UnauthorizedError';
    super(name, 401, code ?? name, message);
  }
}

/**
 * 403 - Forbidden (eg: if not enough user permissions to access a data)
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', code?: string) {
    const name = 'ForbiddenError';
    super(name, 403, code ?? name, message);
  }
}

/**
 * 400 - Bad Request data, parameters, etc.
 */
export class BadRequestError extends AppError {
  /**
   * Consturct custom error.
   *
   * @param {object} args
   * @param {string} args.message Error message
   * @param {string} [args.code]  Optional error code, default is 'BadRequestError'
   * @param {string[]} args.sources - a JSON Pointers [RFC6901] to the value in the
   * request document that caused the error [e.g. "/data" for a primary data object,
   * or "/data/attributes/title" for a specific attribute].
   */
  constructor({
    message = 'Bad Request',
    code,
    sources = [],
  }: {
    message?: string;
    code?: string;
    sources?: Array<string>;
  }) {
    const name = 'BadRequestError';
    super(
      name,
      400,
      code ?? name,
      message,
      sources.map(s => ({ instancePath: s }) as FastifySchemaValidationError),
    );
  }
}

/**
 * 404 - Not Found requested data (eg: if no requested data entity in the DB, etc.)
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Not Found', code?: string) {
    const name = 'NotFoundError';
    super(name, 404, code ?? name, message);
  }
}

/**
 * Our error handling produces jsonapi.org compatible error objects in the responses.
 *   - https://jsonapi.org/examples/#error-objects
 *   - https://jsonapi.org/format/#error-objects
 *
 * @param fastify fastify instance
 * @param opts extra options passed from parent (might be passed with extra config properties inside)
 */
export default async function errorHandler(fastify: FastifyInstance) {
  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      errors: [
        {
          status: 404,
          title: 'Not Found',
          detail: `Route ${request.method} ${request.url} not found`,
        },
      ],
    });
  });

  fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    if (!error.statusCode) {
      const body: Record<string, unknown> = {
        status: 500,
        title: error.name || 'Internal Server Error',
        detail: error.message || 'Something went wrong',
      };

      if (process.env.NODE_ENV !== 'production') {
        if (error.code) body.code = error.code;
        if (error.stack) body.stack = error.stack;
      }

      reply.status(500).send(body);

      return;
    }

    let errorDtos: ErrorDto[] = [];

    if (error.validation && error.validation.length !== 0) {
      errorDtos = error.validation.map(schemaValidationError => {
        const detailArr = [
          error.validationContext ?? '',
          schemaValidationError.instancePath ?? '',
          schemaValidationError.message ?? 'invalid',
        ];
        return {
          status: error.statusCode!,
          title: `${error.name}: ${error.message}`,
          detail: detailArr.join(' ').trim(),
          source: {
            pointer: schemaValidationError.instancePath,
          },
        };
      });
    } else {
      errorDtos.push({
        status: error.statusCode!,
        title: error.name,
        detail: error.message,
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      errorDtos = errorDtos.map(errDto => {
        if (error.code) errDto.code = error.code;
        if (error.stack) errDto.stack = error.stack;
        return errDto;
      });
    }

    reply.status(errorDtos[0].status).send({ errors: errorDtos });
  });
}
