import "dotenv/config";
import { createTopics } from "./config/admin.ts";
import { producer, validateKafkaConfig } from "./config/kafka_manager.ts";
import { PolymarketProducer } from "./producers/polymarket_producer.ts";
import { TwitterProducer } from "./producers/x_producer.ts";
import { consumerConnect, consumer } from "./consumers/consumer.ts";
import { startExpressServer } from "./express/app.ts";

const X_INTERVAL = 15 * 60_000; // 15 minute interval set because Railway only allows 15 minutes CRONS for Job/Worker Roles 
const POLY_INTERVAL =  60_000; // 1 minute for polymarket need to check for API rate


async function shutdown() {
  try {
    await consumer.disconnect();
    await producer.disconnect();
  }
  catch (error) {
    throw new Error(`Shutdown failed due to the following error: ${error}`);
  }
}


async function main() {
  try {
    validateKafkaConfig();
    //
    await createTopics();


    startExpressServer();
    await producer.connect();
    await consumerConnect();

    await PolymarketProducer();
    await TwitterProducer();

    setInterval(() => {
      PolymarketProducer().catch((err) => console.error("Polymarket interval failed:", err));
    }, POLY_INTERVAL);

    setInterval(() => {
      TwitterProducer().catch((err) => console.error("Twitter interval failed:", err));
    }, X_INTERVAL);



    console.log("Kafka layer is operational");
  }
  catch (error) {
    await shutdown();

    throw new Error(`Main loop failed due to the following error: ${error}`);
  }
}

main();


