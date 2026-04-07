import { createTopics } from "./config/admin.ts";
import { fetchDataPolymarket } from "./producers/polymarket_producer.ts";
import { fetchDataX } from "./producers/x_producer.ts";
import { consumerConnect } from "./consumers/consumer.ts";

async function main() {
  try {
    await createTopics();
    await consumerConnect();
    await fetchDataPolymarket();
    await fetchDataX();


    // Controls API call timing currently set to a minute
    setInterval(fetchDataPolymarket, 60_000);
    setInterval(fetchDataX, 60_000);

    console.log("Kafka layer running is operational");
  } 
  catch (error) {
    throw new Error(`Kafka startup failed due to the following error: ${error}`);

  }
}


main();
