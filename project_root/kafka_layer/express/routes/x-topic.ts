import express from "express";
import { apacheKafkaEvents, feedData} from "../../consumers/consumer";
import { SSE_HEADERS, TOPICS } from "./constants";



const router = express.Router();

router.get("/stream/x", (req, res) => {

  res.status(200); 
  res.set(SSE_HEADERS);
  res.flushHeaders();

  const recent = (feedData[TOPICS.TWITTER] ?? []).slice(-25).reverse();

  res.write(`event: snapshot\ndata: ${JSON.stringify(recent)}\n\n`);

  const onMessage = (payload: unknown) => {
    res.write(`event: tweetAdded\ndata: ${JSON.stringify(payload)}\n\n`);
  };
  apacheKafkaEvents.on(TOPICS.TWITTER, onMessage);

  const ping = setInterval(() => res.write(": keepalive\n\n"), 25_000);

  req.on("close", () => {
    apacheKafkaEvents.off(TOPICS.TWITTER, onMessage);
    clearInterval(ping);
    res.end();
  });
});

export default router;
