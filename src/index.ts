import { db } from './db/kysely/database.js';
import { migrateDown, migrateToLatest } from './db/kysely/migrator.js';
import { Envs } from './plugins/envs.js';
import { build } from './server.js';

const start = async () => {
  const fastifyApp = await build();

  try {
    await migrateToLatest(db);
    // await migrateDown(db)

    await fastifyApp.listen({
      port: fastifyApp.getEnvs<Envs>().PORT,
      host: fastifyApp.getEnvs<Envs>().HOST,
    });
  } catch (err) {
    fastifyApp.log.error(err);
    process.exit(1);
  }
};

start();
