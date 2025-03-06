
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT || 5432),
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'password',
});
pool.query('CREATE DATABASE personal_webpage')
  .then(() => { console.log('Database created!'); process.exit(0); })
  .catch(err => { console.error(err); process.exit(1); });

