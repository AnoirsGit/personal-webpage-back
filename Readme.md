## Local development

1. Install `pnpm`

```sh
corepack install --global pnpm@*
```

2. Copy `.env.sample` file to `.env` and set necessary variables.
3. Install dependencies

```sh
pnpm install
```

### Related 3'rd party services

Use docker compose to setup necessary backend services (eg: postgres DB)

1. Setup docker containers, first

```sh
docker compose -f docker-compose.yml up -d
```

2. Start docker containers (NOTICE: it has been already started after `docker compose up` command, see above). Start it again only if you did `docker compose stop` before (see below).

```sh
docker compose -f docker-compose.yml start
```

3. Stop docker containers

```sh
docker compose -f docker-compose.yml stop
```

4. Remove docker containers

```sh
docker compose -f docker-compose.yml down
```

### Migration

We use DB migration mechanism based on [Kysely migrations](https://kysely.dev/docs/migrations).

Add your migration scripts further to [src/database/migrations/](src/database/migrations/).
Script naming convention: `YYYYMMDDHHMM__your_script_name_describin_what_it_does.ts`.

### Test users to pass authorization

- 'Mobivity' team (MOBIVITY): `john.doe@none.none / 12qwaszx`
- 'Test SUPPLY team' (SUPPLY): `test.supply@none.none / 12qwaszx`
- 'Test DEMAND team' (DEMAND): `test.demand@none.none / 12qwaszx`

### Development recommendations

**SQL queries**

By default, we use Kysely API to construct SQL queries everywhere (in migration scripts, in the app code as well).
For example:

```typescript
await db.schema
  .createTable('my_table')
  .addColumn('id', 'integer', col => col.primaryKey().generatedAlwaysAsIdentity())
  .addColumn('name', 'varchar', col => col.notNull())
  .execute();
```

Anyway, it might be a situation when we can't use Kysely API (eg: generated SQl request is not optimized for our needs).
In this case we can construct query using raw SQL - see [Kysely RawBuilder](https://kysely-org.github.io/kysely-apidoc/interfaces/RawBuilder.html) for more details.
Here is an example:

```
await sql`
  CREATE TABLE my_table (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );
 `.execute(db);
```

Main rules to choose which way to use in the code:

- By default, we use Kysely API as a primary approach to construct SQL queries.
- We use raw SQL approach if anything impossible to implement (or unacceptable) using Kysely API.
