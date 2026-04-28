import kafka from "../config/kafka_manager.ts";

const consumer = kafka.consumer({ groupId: "ontology-group" });

export async function consumerConnect() {
  await consumer.connect();

  await consumer.subscribe({ 
    topics: ["polymarket-data", "x-news-feed"], 
    fromBeginning: true 
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {

      const value = message.value?.toString();

      if (!value) {
        return;
      }

      const parsed = JSON.parse(value);

      switch (topic) {
        
        case "polymarket-data":
          console.log("Market data:", parsed);
          break;

        case "x-news-feed":
          console.log("News feed:", parsed);
          break;
      }
    },
  });

  console.log("Consumer is up and running");
}


