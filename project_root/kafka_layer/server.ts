import { createTopics } from "./config/admin.ts";
import { producer } from "./config/kafka_manager.ts";
import { fetchDataPolymarket } from "./producers/polymarket_producer.ts";
import { fetchDataX } from "./producers/x_producer.ts";
import { consumerConnect, consumerDisconnect } from "./consumers/consumer.ts";

const Given_Interval = 60_000;

async function runProducerSafely(label: string, producerName: () => Promise<void>) {
  try {
    await producerName();
  } 
  catch (error) {
    throw new Error(`The given producer ${label} run failed due to the following:, ${error}`);
  }
}

async function shutdown() {
  try {
    await producer.disconnect();
    await consumerDisconnect();

  } 
  catch (error) {
    throw new Error(`Shutdown failed due to the following error:, error`);
  }
}


async function main() {
  try {
    await createTopics();
    await producer.connect();
    await consumerConnect();

    await runProducerSafely("polymarket", fetchDataPolymarket);
    await runProducerSafely("x", fetchDataX);

    setInterval(() => {
      runProducerSafely("polymarket", fetchDataPolymarket);
    }, Given_Interval);

    setInterval(() => {
      runProducerSafely("x", fetchDataX);
    }, Given_Interval);

    console.log("Kafka layer is operational");
  }
  catch (error) {
    await shutdown();
    throw new Error(`Kafka startup failed due to the following error: ${error}`);
  }
}

main();
