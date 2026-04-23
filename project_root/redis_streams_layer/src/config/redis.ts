import Redis from "ioredis" 



const redisUrl = process.env.redis_url; 

if(!redisUrl){ 
    throw new Error("The proper redis url key from railway has not been set"); 
}

export const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
});







