import Redis from "ioredis";
import { fetchAlphaVantageNews } from "./src/streams/producers.ts";



async function main(): Promise<void> {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    throw new Error("The proper redis url key from railway has not been set");
  }

  const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
  });

  try {
    await redis.ping();

    console.log("Redis-streams on Railway has been reached");

    const appendedEntry = await fetchAlphaVantageNews(redis);

    console.log(`The following ${appendedEntry} have been added to the redis log`);

  }
  catch (error) {
    throw new Error(`Failed to connect to the redis instance on railway due to the following error: ${error}`);
  }
  finally {
    await redis.quit();
  }
}

main();
