import { producer } from "../config/kafka_manager.ts";
import { fetchPoliticalEvents } from "./api_layer/polymarket_api.ts";

export async function fetchDataPolymarket() {
    try {
        const events = (await fetchPoliticalEvents()) as any[];

        if (!Array.isArray(events) || events.length === 0) {
            return;
        }

        const messages = events.map((event) => ({
            key: String(event.id || event.slug),
            value: JSON.stringify(event),
        }));

        await producer.send({
            topic: "market-data",
            messages,
        });
    }
    catch (error) {
        throw new Error(`Failed to write to the kafka broker due to the following reason: ${error}`);
    }
}
