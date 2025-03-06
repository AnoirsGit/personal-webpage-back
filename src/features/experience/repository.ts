import { db } from '../../db/kysely/database.js';
import { ExperienceEntity, ExperienceInsertEntity, ExperienceUpdateEntity } from './model.js';

export async function findAll(): Promise<{ data: ExperienceEntity[]; count: number }> {
  let qb = db.selectFrom('experiences').selectAll();

  const countResult = await db
    .selectFrom('experiences')
    .select(db.fn.countAll().as('count'))
    .executeTakeFirst();
  const count = countResult ? Number(countResult.count) : 0;

  const data = await qb.execute();
  return { data, count };
}

export async function findOneById(
  params: { id: number },
): Promise<ExperienceEntity | undefined> {
  return (await db
    .selectFrom('experiences')
    .selectAll()
    .where('id', '=', params.id)
    .executeTakeFirst());
}

export async function create(
  data: ExperienceInsertEntity,
): Promise<ExperienceEntity> {

  const result = await db
    .insertInto('experiences')
    .values(data)
    .returningAll()
    .executeTakeFirst();
  if (!result) {
    throw new Error('Failed to create experience');
  }
  return result;
}

export async function update(
  data: { id: number } & ExperienceUpdateEntity,
): Promise<ExperienceEntity | undefined> {
  const result = await db
    .updateTable('experiences')
    .set(data)
    .where('id', '=', data.id)
    .returningAll()
    .executeTakeFirst();
  return result;
}

export async function deleteOneById(
  params: { id: number },
): Promise<number> {
  const result = await db
    .deleteFrom('experiences')
    .where('id', '=', params.id)
    .execute();
  return result.length;
}
