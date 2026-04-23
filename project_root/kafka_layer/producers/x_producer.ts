import { producer } from "../config/kafka_manager.ts";
import { fetchRecentTweets } from "./api_layer/x_api.ts";

export async function fetchDataX() {
    try {
        const tweets = (await fetchRecentTweets("Trump Administration")) as any[];

        if (!Array.isArray(tweets) || tweets.length === 0) {
            return;
        }

        const messages = tweets.map((tweet) => ({
            key: String(tweet.id || tweet.author_id),
            value: JSON.stringify(tweet),
        }));

        await producer.send({
            topic: "news-feed",
            messages,
        });
    }
    catch (error) {
        throw new Error(`The X producer failed to write due to the following reason: ${error}`);
    }
}
