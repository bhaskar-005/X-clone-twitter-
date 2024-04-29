import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 500,
  connectTimeout: 10000,
  lazyConnect: true
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error);
});

export { redisClient };
