import kafka from "../config/kafka_manager.ts";

export const consumer = kafka.consumer({ groupId: "ontology-group" });

export async function consumerConnect() {
  await consumer.connect();

  await consumer.subscribe({
    topics: ["polymarket-data", "x-news-feed"],
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {

      const value = message.value?.toString();

      if (!value){
        return;
      } 

      try {
        const parsed = JSON.parse(value);
        
        const ts = new Date().toISOString().slice(11, 19);

        switch (topic) {
          case "polymarket-data": {
            const title = String(parsed.title ?? "").slice(0, 60);

            console.log(`[${ts}] markets | ${title} | yes=${parsed.yesPrice ?? "?"} vol=${parsed.volume ?? "?"}`);

            break;
          }
          case "x-news-feed": {
            const text = String(parsed.text ?? "").replace(/\s+/g, " ").slice(0, 80);

            console.log(`[${ts}] news    | @${parsed.username ?? "?"}: ${text}`);

            break;
          }
          default:
            console.log(`[${ts}] unknown topic ${topic}:`, parsed);
        }
      }
      catch (error) {
        console.error(`Bad JSON on ${topic}:`, error);
      }
    },
  });

  console.log("Consumer is up and running");
}
