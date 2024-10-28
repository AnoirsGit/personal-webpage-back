import Koa from 'koa';
import { prisma, redis } from './config';

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

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  redis.quit();
  process.exit(0);
});
