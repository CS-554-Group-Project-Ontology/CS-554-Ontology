import * as z from "zod";
import { producer } from "../config/kafka_manager.ts";
import { fetchPolymarketEvents, kafkaPolymarketTopics } from "./api_layer/polymarket_api.ts";





const finalPolymarketEventSchema = z.object({
  id: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(0),
  startDate: z.string().trim().min(0),
  endDate: z.string().trim().min(0),
  active: z.boolean().default(false),
  closed: z.boolean().default(false),
  liquidity: z.number().nonnegative().default(0),
  volume: z.number().nonnegative().default(0),
  category: z.string().trim().optional(),
  subcategory: z.string().trim().optional(),
  yesPrice: z.number().optional(),
  bestBid: z.number().optional(),
  bestAsk: z.number().optional(),
  oneDayPriceChange: z.number().optional(),
});

type FinalPolymarketEvent = z.infer<typeof finalPolymarketEventSchema>;

interface RawPolymarketMarket {
  lastTradePrice: number;
  bestBid: number;
  bestAsk: number;
  oneDayPriceChange: number;
}

interface RawPolymarketEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  active: boolean;
  closed: boolean;
  liquidity: number | string;
  volume: number | string;
  category: string;
  subcategory: string;
  markets: RawPolymarketMarket[];
}

function toPolymarketEvent(rawEvent: RawPolymarketEvent): FinalPolymarketEvent {
  const firstMarket = rawEvent.markets?.[0];

  if (!firstMarket) {
    throw new Error(`Event ${rawEvent.id} has no markets`);
  }

  return finalPolymarketEventSchema.parse({
    id: rawEvent.id,
    slug: rawEvent.slug,
    title: rawEvent.title,
    description: rawEvent.description,
    startDate: rawEvent.startDate,
    endDate: rawEvent.endDate,
    active: Boolean(rawEvent.active),
    closed: Boolean(rawEvent.closed),
    liquidity: Number(rawEvent.liquidity),
    volume: Number(rawEvent.volume),
    category: rawEvent.category,
    subcategory: rawEvent.subcategory,
    yesPrice: firstMarket.lastTradePrice,
    bestBid: firstMarket.bestBid,
    bestAsk: firstMarket.bestAsk,
    oneDayPriceChange: firstMarket.oneDayPriceChange,
  });
}

export async function PolymarketProducer() {
  for (const topic of kafkaPolymarketTopics) {
    try {
      const events = (await fetchPolymarketEvents(topic.name, topic.tag)) as RawPolymarketEvent[];

      if (!Array.isArray(events) || events.length === 0) {
        continue;
      }

      const formatted: FinalPolymarketEvent[] = [];


      for (const event of events) {
        try {
          formatted.push(toPolymarketEvent(event));
        }
        catch (error) {
          console.log(`Skipping invalid event ${event.id} from tag "${topic.name}":`, error);
        }
      }

      if (formatted.length === 0) {
        continue;
      }

      const messages = formatted.map((event) => ({
        key: event.id,
        value: JSON.stringify(event),
      }));

      await producer.send({
        topic: "polymarket-data",
        messages,
      });
    }
    catch (error) {
      console.log(`Tag "${topic.name}" failed, continuing to next:`, error);
    }
  }
}
