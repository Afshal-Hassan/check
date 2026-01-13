import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries: any) => {
      if (retries > 10) {
        return new Error('Redis connection failed after 10 retries');
      }
      return retries * 100;
    },
  },
});

redisClient.on('error', (err: any) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
};

export default redisClient;
