import express from "express";
import { apacheKafkaEvents, feedData } from "../../consumers/consumer";

const router = express.Router();
const TOPIC = "polymarket-data";

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  "Connection": "keep-alive",
  "X-Accel-Buffering": "no",
} as const;


router.get("/stream/polymarket", (req, res) => {

  res.status(200); 
  res.set(SSE_HEADERS);
  res.flushHeaders();

  const polymarketSnapshot = (feedData[TOPIC] ?? []).slice(-25).reverse();


  res.write(`event: snapshot\ndata: ${JSON.stringify(polymarketSnapshot)}\n\n`);


  const onMessage = (payload: unknown) => {
    res.write(`event: marketUpdated\ndata: ${JSON.stringify(payload)}\n\n`);
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
