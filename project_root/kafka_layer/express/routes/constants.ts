export const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  "Connection": "keep-alive",
  "X-Accel-Buffering": "no",
  "Access-Control-Allow-Origin": "*",
} as const;

export const TOPICS = {
  POLYMARKET: "polymarket-data",
  TWITTER: "x-news-feed",
  ALPHA_VANTAGE_NEWS: "news-articles-feed",
} as const;

export type KafkaTopic = typeof TOPICS[keyof typeof TOPICS];
