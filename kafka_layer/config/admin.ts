import kafka from "./kafka_manager.ts";

const admin = kafka.admin();

export async function createTopics() {
    try{
        await admin.connect();

        await admin.createTopics({
            topics: [
                { 
                    topic: "market-data", 
                    numPartitions: 1, 
                    replicationFactor: 1 
                },
                { 
                    topic: "news-feed", 
                    numPartitions: 1, 
                    replicationFactor: 1 
                },
            ],
        });
    }
    catch(error){ 
        throw new Error("Th given topics failed to be created")

    }

}
