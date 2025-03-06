import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promises as fs } from 'fs';
import path from 'path';
import { FileMigrationProvider, Kysely, MigrationResultSet, Migrator } from 'kysely';
import { Database } from './schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


function processMigrationResult(prefixLogMessage: string, migrationResultSet: MigrationResultSet) {
  const error = migrationResultSet.error;
  const results = migrationResultSet.results;

  results?.forEach(it => {
    console.log(`${prefixLogMessage} ${it.status}: ${it.migrationName}`);
  });

  if (error) {
    console.error(`${prefixLogMessage} error:`, error);
    process.exit(1);
  }
}

function migrator(db: Kysely<Database>): Migrator {
  const migrationProvider = new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, '../migrations'),
  });

  return new Migrator({
    db,
    provider: migrationProvider,
  });
}

export async function migrateToLatest(db: Kysely<Database>) {
  processMigrationResult('Migrate to latest', await migrator(db).migrateToLatest());
}

export async function migrateDown(db: Kysely<Database>) {
  processMigrationResult('Migrate one step down', await migrator(db).migrateDown());
}
