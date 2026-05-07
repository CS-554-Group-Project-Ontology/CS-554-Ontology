import express from "express";
import { apacheKafkaEvents, feedData } from "../../consumers/consumer";
import { SSE_HEADERS, TOPICS } from "./constants";


const router = express.Router();

router.get("/stream/polymarket", (req, res) => {
  res.status(200); 
  res.set(SSE_HEADERS);
  res.flushHeaders();

  const polymarketSnapshot = (feedData[TOPICS.POLYMARKET] ?? []).slice(-25).reverse();


  res.write(`event: snapshot\ndata: ${JSON.stringify(polymarketSnapshot)}\n\n`);


  const onMessage = (payload: unknown) => {
    res.write(`event: marketUpdated\ndata: ${JSON.stringify(payload)}\n\n`);
  };
  apacheKafkaEvents.on(TOPICS.POLYMARKET, onMessage);

  const ping = setInterval(() => res.write(": keepalive\n\n"), 25_000);

  req.on("close", () => {
    apacheKafkaEvents.off(TOPICS.POLYMARKET, onMessage);
    clearInterval(ping);
    res.end();
  });
});

export default router;
