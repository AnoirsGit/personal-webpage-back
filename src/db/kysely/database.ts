import pg from "pg";
import { Database } from "./schema.js";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";

const { Pool } = pg;

const tempPool = new Pool({
  host: process.env.PG_HOST,
  port: Number.parseInt(process.env.PG_PORT ?? "5432"),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: "postgres", 
});

const ensureDatabaseExists = async () => {
  const dbName = process.env.PG_DATABASE;
  if (!dbName) throw new Error("PG_DATABASE is not set in the environment variables.");


  const client = await tempPool.connect();
  try {
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1;`, [dbName]);
    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${dbName}";`);
      console.log(`Database "${dbName}" created successfully.`);
    }
  } finally {
    client.release();
  }
};

await ensureDatabaseExists();
await tempPool.end(); 

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.PG_HOST,
      port: Number.parseInt(process.env.PG_PORT ?? "5432"),
      database: process.env.PG_DATABASE,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      max: Number.parseInt(process.env.PG_DATABASE_POOL_SIZE ?? "10"),
    }),
  }),
  plugins: [new CamelCasePlugin()],
});
