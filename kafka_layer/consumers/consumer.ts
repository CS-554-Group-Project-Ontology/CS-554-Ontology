





import kafka from "../config/kafka_manager.ts";

const consumer = kafka.consumer({ groupId: "ontology-group" });

export async function consumerConnect() {
  await consumer.connect();

  await consumer.subscribe({ topics: ["market-data", "signals", "news-feed"] });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value?.toString();

      if (!value){
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
        case "signals":

          console.log("Signal:", parsed);
          break;
      }
    },
  });

  console.log("Consumer running");
}

