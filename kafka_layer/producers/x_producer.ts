import kafka from "../config/kafka_manager.ts";
import { fetchRecentTweets } from "./api_layer/x_api.ts";

const producer = kafka.producer();

export async function fetchDataX() {
    try{
        await producer.connect();

        const tweets = (await fetchRecentTweets("Trump Administration")) as any[];

        const messages = [];

        for (const tweet of tweets) {
            messages.push({
                key: String(tweet.id || tweet.author_id),
                value: JSON.stringify(tweet),
            });
        }

        await producer.send({
            topic: "news-feed",
            messages,
        });
    }
    catch(error){ 
        throw new Error(`The X producer failed to write for the follwing reasons for the given reason: ${error}`);
    }
}
