import Koa from 'koa';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || 'DORIME', // Include Redis password
});

const app = new Koa();
const port = 3000;


redis.set('testKey', 'Hello Redis with Auth!');

app.use(async (ctx) => {
  const redisValue = await redis.get('testKey');
  ctx.body = `Hello World and ${redisValue}`;
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
