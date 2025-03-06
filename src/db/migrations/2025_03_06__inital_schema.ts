import { Kysely, sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'integer', col => col.primaryKey().generatedAlwaysAsIdentity())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('password', 'varchar', (col) => col.notNull())
    .addColumn('location_id', 'integer', (col) => col.notNull())
    .addColumn('job_title', 'varchar(255)')
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema
    .createTable('locations')
    .addColumn('id', 'integer', col => col.primaryKey().generatedAlwaysAsIdentity())
    .addColumn('country_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('latitude', 'float8', (col) => col.notNull())
    .addColumn('longitude', 'float8', (col) => col.notNull())
    .addColumn('country_code', 'varchar(10)', (col) => col.notNull())
    .addColumn('continent_name', 'varchar(255)', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('contacts')
    .addColumn('id', 'integer', col => col.primaryKey().generatedAlwaysAsIdentity())
    .addColumn('email', 'varchar(255)', (col) => col.notNull())
    .addColumn('phone', 'varchar(20)', (col) => col.notNull())
    .addColumn('linkedin_url', 'varchar(255)', (col) => col.notNull())
    .addColumn('telegram_url', 'varchar(255)', (col) => col.notNull())
    .addColumn('cv_url', 'varchar(1024)')
    .addColumn('telegram_tag', 'varchar(255)', (col) => col.notNull())
    .addColumn('github_url', 'varchar(255)', (col) => col.notNull())
    .addColumn('github_tag', 'varchar(255)', (col) => col.notNull())
    .addColumn('user_id', 'integer', (col) => col.unique().references('users.id').onDelete('cascade'))
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema
    .createTable('skill_trees')
     .addColumn('id', 'integer', col => col.primaryKey().generatedAlwaysAsIdentity())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('user_id', 'integer', (col) => col.unique().references('users.id').onDelete('cascade'))
    .execute();

  await db.schema
    .createTable('nodes')
     .addColumn('id', 'integer', col => col.primaryKey().generatedAlwaysAsIdentity())
    .addColumn('tree_id', 'integer', (col) => col.references('skill_trees.id').onDelete('cascade'))
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('is_node', 'boolean', (col) => col.notNull())
    .addColumn('tags', 'jsonb', (col) => col.defaultTo(sql`'[]'::jsonb`))
    .addColumn('position_x', 'float8', (col) => col.notNull())
    .addColumn('position_y', 'float8', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('edges')
     .addColumn('id', 'integer', col => col.primaryKey().generatedAlwaysAsIdentity())
    .addColumn('tree_id', 'integer', (col) => col.references('skill_trees.id').onDelete('cascade'))
    .addColumn('source_node_id', 'integer', (col) => col.notNull())
    .addColumn('target_node_id', 'integer', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('experiences')
     .addColumn('id', 'integer', col => col.primaryKey().generatedAlwaysAsIdentity())
    .addColumn('color', 'varchar(10)', (col) => col.notNull())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('position', 'varchar(255)', (col) => col.notNull())
    .addColumn('place', 'varchar(255)', (col) => col.notNull())
    .addColumn('base_description', 'text', (col) => col.notNull())
    .addColumn('tags', 'jsonb', (col) => col.defaultTo(sql`'[]'::jsonb`))
    .addColumn('start_date', 'timestamp', (col) => col.notNull())
    .addColumn('end_date', 'timestamp')
    .addColumn('user_id', 'integer', (col) => col.unique().references('users.id').onDelete('cascade'))
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('experiences').execute();
  await db.schema.dropTable('edges').execute();
  await db.schema.dropTable('nodes').execute();
  await db.schema.dropTable('skill_trees').execute();
  await db.schema.dropTable('contacts').execute();
  await db.schema.dropTable('users').execute();
  await db.schema.dropTable('locations').execute();
}
