import { createTopics } from "./config/admin.ts";
import { producer } from "./config/kafka_manager.ts";
import { PolymarketProducer } from "./producers/polymarket_producer.ts";
import { TwitterProducer } from "./producers/x_producer.ts";
import { consumerConnect } from "./consumers/consumer.ts";
import 'dotenv/config';

const X_INTERVAL = 15 * 60_000; // 15 minute interval set because Railway only allows 15 minutes CRONS for Job/Worker Roles 
const POLY_INTERVAL =  60_000; // 1 minute for polymarket need to check for API rate


async function shutdown() {
  try {
    await producer.disconnect();
  }
  catch (error) {
    throw new Error(`Shutdown failed due to the following error ${error}: error`);
  }
}


async function main() {
  try {
    await createTopics();
    await producer.connect();
    await consumerConnect();

    await PolymarketProducer();
    await TwitterProducer();

    setInterval(() => {
      PolymarketProducer();
    }, POLY_INTERVAL);

    setInterval(() => {
      TwitterProducer();
    }, X_INTERVAL);



    console.log("Kafka layer is operational");
  }
  catch (error) {
    await shutdown();

    throw new Error(`Shutdown failed due to the following error: ${error}`);
  }
}

main();
