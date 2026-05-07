import express from "express";
import { apacheKafkaEvents } from "../../consumers/consumer";
import { feedData } from "../../consumers/consumer";

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  "Connection": "keep-alive",
  "X-Accel-Buffering": "no",
} as const;


const router = express.Router();
const TOPIC = "x-news-feed";

router.get("/streams/x", (req, res) => {

  res.set(SSE_HEADERS);
  res.flushHeaders();

  const recent = (feedData[TOPIC] ?? []).slice(-25).reverse();

  res.write(`event: snapshot\ndata: ${JSON.stringify(recent)}\n\n`);

  const onMessage = (payload: unknown) => {
    res.write(`event: tweetAdded\ndata: ${JSON.stringify(payload)}\n\n`);
  };
  apacheKafkaEvents.on(TOPIC, onMessage);

  const ping = setInterval(() => res.write(": keepalive\n\n"), 25_000);

  req.on("close", () => {
    apacheKafkaEvents.off(TOPIC, onMessage);
    clearInterval(ping);
    res.end();
  });
});

export default router;
