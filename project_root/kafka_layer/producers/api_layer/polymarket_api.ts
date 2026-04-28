import axios from "axios";
const GAMMA_API = "https://gamma-api.polymarket.com";

interface PolymarketTopic {
  name: string;       
  tag: string;        
}

export const kafkaPolymarketTopics: PolymarketTopic[] = [
  { name: "politics",    tag: "Politics" },
  { name: "economy",     tag: "Economy" },
  { name: "crypto",      tag: "Crypto" },
  { name: "geopolitics", tag: "Geopolitics" },
];

export async function fetchPolymarketEvents(topicName: string,tag: string, limit: number = 30, skipCounter: number = 0,) {
  try {
    const response = await axios.get(`${GAMMA_API}/events`, {
      params: {
        tag,
        limit: String(limit),
        offset: String(skipCounter),
        active: "true",
        closed: "false",
      },
    });

    if (!response.data) {
      throw new Error("No data returned from the gamma API");
    }

    return response.data;
  }
  catch (error) {
     throw new Error(`Failed to fetch Polymarket events for "${topicName}": ${error}`);
  }
}

