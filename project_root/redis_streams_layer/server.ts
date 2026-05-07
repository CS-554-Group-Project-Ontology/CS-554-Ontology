import Redis from "ioredis";
import { Kafka, type Producer } from "kafkajs";
import { fetchAlphaVantageNews, syncRedisStreamToKafka } from "./src/streams/producers.ts";
import { NEWS_STREAM } from "./src/streams/streams_config.ts";


const FETCH_INTERVAL = 60 * 60_000;


function redisRailwayConnect() {
  try {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      throw new Error("The REDIS_URL key from Railway has not been set");
    }

    return new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
    });
  }
  catch (error) {
    throw new Error(`Failed to connect Redis Railway Instance due to the following error: ${error}`);
  }
}
async function runProducer(redis: Redis): Promise<void> {
  try {
    const appendedEntry = await fetchAlphaVantageNews(redis);

    console.log(`The following ${appendedEntry} have been added to the redis log`);
  }
  catch (error) {
    throw new Error(`Failed to run the producer due to the following error ${error}`);
  }
}
async function runNewsCycleToKafka(redis: Redis, kafkaProducer: Producer): Promise<void> {
  await runProducer(redis);
  try {
    const count = await syncRedisStreamToKafka(redis, kafkaProducer);

    console.log(`Transferred ${count} new entries from ${NEWS_STREAM} to kafka topic news-articles-feed on the kafka broker`);
  }
  catch (error) {
    throw new Error(`Failed to sync data from the redis streams instance to apache kafka broker due to the following error: ${error}`);
  }
}


async function shutDown(redis: Redis, kafkaProducer: Producer): Promise<void> {
  try {
    await kafkaProducer.disconnect();
    await redis.quit();
  } 
  catch (error) {
    console.error("Shutdown failed:", error);
  }
}





async function main(): Promise<void> {
  const redis = redisRailwayConnect();

  const kafkaBroker = process.env.KAFKA_PUBLIC;

  if (!kafkaBroker) {
    throw new Error("The KAFKA_PUBLIC variable has not been set within the .env file");
  }

  const kafka = new Kafka({
    clientId: "redis-streams-client",
    brokers: [kafkaBroker],
  });

  const kafkaProducer = kafka.producer();

  try {
    await redis.ping();
    console.log(" The connection to Redis instance on railway was sucessful");

    await kafkaProducer.connect();
    console.log("The Kafka producer connected successfully ");

    await runNewsCycleToKafka(redis, kafkaProducer);

    setInterval(() => {
      runNewsCycleToKafka(redis, kafkaProducer).catch((error) => {
        console.error("Interval tick failed:", error);
      });
    }, FETCH_INTERVAL);
  } 
  catch (error) {
    await shutDown(redis, kafkaProducer);
    throw error;
  }
}

main();
