import { Insertable, Selectable, Updateable } from "kysely";
import { ExperiencesTable } from "../../db/kysely/schema.js";
import { FromSchema } from "json-schema-to-ts";

export const experienceItemResponseSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    title: { type: "string" },
    color: { type: "string" },
    position: { type: "string" },
    place: { type: "string" },
    base_description: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    start_date: { type: "string", format: "date-time" },
    end_date: {
      anyOf: [{ type: "string", format: "date-time" }, { type: "null" }],
    },
    user_id: { type: "integer" },
    created_at: { type: "string", format: "date-time" },
    updated_at: { type: "string", format: "date-time" },
  },
  required: [
    "id",
    "title",
    "color",
    "position",
    "place",
    "base_description",
    "tags",
    "start_date",
    "user_id",
    "created_at",
    "updated_at",
  ],
} as const;

export const createExperienceRequestSchema = {
  type: "object",
  properties: {
    color: { type: "string", minLength: 1 },
    title: { type: "string", minLength: 1 },
    position: { type: "string", minLength: 1 },
    place: { type: "string", minLength: 1 },
    base_description: { type: "string", minLength: 1 },
    tags: { type: "array", items: { type: "string" }, default: [] },
    start_date: { type: "string", format: "date-time" },
    end_date: { type: "string", format: "date-time", nullable: true },
    user_id: { type: "integer", minLength: 1 },
  },
  required: [
    "color",
    "title",
    "position",
    "place",
    "base_description",
    "start_date",
    "user_id",
  ],
  additionalProperties: false,
} as const;

export const updateExperienceRequestSchema = {
  type: "object",
  properties: {
    color: { type: "string", minLength: 1 },
    title: { type: "string", minLength: 1 },
    position: { type: "string", minLength: 1 },
    place: { type: "string", minLength: 1 },
    base_description: { type: "string", minLength: 1 },
    tags: { type: "array", items: { type: "string" } },
    start_date: { type: "string", format: "date-time" },
    end_date: { type: "string", format: "date-time", nullable: true },
  },
  additionalProperties: false,
} as const;

// Types based on the underlying database schema
export type ExperienceEntity = Selectable<ExperiencesTable>;
export type ExperienceInsertEntity = Omit<Insertable<ExperiencesTable>, "id">;
export type ExperienceUpdateEntity = Updateable<ExperiencesTable>;

// JSON schema-based types for our API responses and requests

export type CreateExperienceRequest = FromSchema<
  typeof createExperienceRequestSchema,
  {
    deserialize: [
      { pattern: { type: "string"; format: "date-time" }; output: Date },
    ];
  }
>;
export type UpdateExperienceRequest = FromSchema<
  typeof updateExperienceRequestSchema,
  {
    deserialize: [
      { pattern: { type: "string"; format: "date-time" }; output: Date },
    ];
  }
>;
export type ExperienceItemResponse = FromSchema<
  typeof experienceItemResponseSchema,
  {
    deserialize: [
      { pattern: { type: "string"; format: "date-time" }; output: Date },
    ];
  }
>;
