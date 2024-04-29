import Redis from "ioredis"

export const redisClient = new Redis(process.env.REDIS_URL!,{
    maxRetriesPerRequest:500,
    connectTimeout: 10000,
    lazyConnect:true,
});
