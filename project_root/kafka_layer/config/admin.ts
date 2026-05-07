import kafka from "./kafka_manager.ts";
import { TOPICS } from "../express/routes/constants.ts";

const admin = kafka.admin();

export async function createTopics() {
    try{
        await admin.connect();

        console.log("You have successfully connected to kafka");

        await admin.createTopics({
            topics: [
                {
                    topic: TOPICS.POLYMARKET,
                    numPartitions: 1, 
                },
                {
                    topic: TOPICS.TWITTER,
                    numPartitions: 1,
                },
                {
                    topic: TOPICS.ALPHA_VANTAGE_NEWS,
                    numPartitions: 1,
                },
            ],
        });
    }
    catch(error){
        throw new Error(`The given topics failed to be created: ${error}`);
    }
    finally {
        await admin.disconnect();
    }
}
