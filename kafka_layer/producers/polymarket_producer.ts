import kafka from "../config/kafka_manager.ts";
import { fetchPoliticalEvents } from "./api_layer/polymarket_api.ts";

const producer = kafka.producer();

export async function fetchDataPolymarket() {
    try{
        await producer.connect();

        const events = (await fetchPoliticalEvents()) as any[];

        const messages = [];
        
        for (const event of events) {
            messages.push({
                key: String(event.id || event.slug),
                value: JSON.stringify(event),
            });
        }


        await producer.send({
            topic: "market-data",
            messages,
        });
    }
    catch(error){ 
        throw new Error(`Failed to connect to write the kafka broker for the given reason: ${error}`); 
    }

}
