import kafka from "../config/kafka_manager.ts";
import EventEmitter from "node:events";
import { TOPICS } from "../express/routes/constants.ts";

export const consumer = kafka.consumer({ groupId: "ontology-group" });


export const apacheKafkaEvents = new EventEmitter();

export const feedData: Record<string, unknown[]> = {
  [TOPICS.TWITTER]: [],
  [TOPICS.POLYMARKET]: [],
  [TOPICS.ALPHA_VANTAGE_NEWS]: [],
}

export const TOPIC_LENGTH = 65;




export async function consumerConnect() {
  await consumer.connect();

  await consumer.subscribe({
    topics: [TOPICS.POLYMARKET, TOPICS.TWITTER, TOPICS.ALPHA_VANTAGE_NEWS],
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


        const messageData = feedData[topic]


        if(messageData){
          messageData.push(parsed);

          if(messageData.length > TOPIC_LENGTH){
            messageData.shift();
          }

        }


        apacheKafkaEvents.emit(topic,parsed)



        const ts = new Date().toISOString().slice(11, 19); 

        switch (topic) {
          case TOPICS.POLYMARKET: {
            const title = String(parsed.title ?? "").slice(0, 60);

            console.log(`[${ts}] markets | ${title} | yes=${parsed.yesPrice ?? "?"} vol=${parsed.volume ?? "?"}`);

            break;
          }
          case TOPICS.TWITTER: {
            const text = String(parsed.text ?? "").replace(/\s+/g, " ").slice(0, 80);

            console.log(`[${ts}] news    | @${parsed.username ?? "?"}: ${text}`);

            break;
          }
          case TOPICS.ALPHA_VANTAGE_NEWS: {
            const title = String(parsed.title ?? "").slice(0, 60);

            console.log(`[${ts}] article | ${parsed.sourceUrl ?? "?"} | ${title}`);

            break;
          }
          default:
            console.log(`[${ts}] unknown topic ${topic}:`, parsed);
        }
      }
      catch (error) {
        console.error(`Bad JSON for the following topic: ${topic} due to this error:`, error);
      }
    },
  });

  console.log("Consumer is up and running");
}
