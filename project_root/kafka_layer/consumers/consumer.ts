import kafka from "../config/kafka_manager.ts";

const consumer = kafka.consumer({ groupId: "ontology-group" });

export async function consumerConnect() {
  await consumer.connect();

  await consumer.subscribe({ topics: ["market-data", "news-feed"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const value = message.value?.toString();

      if (!value) {
        return;
      }

      const parsed = JSON.parse(value);

      switch (topic) {
        case "market-data":
          console.log("Market data:", parsed);
          break;
        case "news-feed":
          console.log("News feed:", parsed);
          break;
      }
    },
  });

  console.log("Consumer is up and running");
}

export async function consumerDisconnect() {
  try{
    await consumer.disconnect();
  }
  catch(error){ 
    throw new Error(`Failed to disconnect the consumer due to the following ${error}`)
  }
}
