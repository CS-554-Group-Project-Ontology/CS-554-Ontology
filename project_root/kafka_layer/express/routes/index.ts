import { Router } from "express";
import polymarketRouter from "./polymarket-topic";
import xRouter from "./x-topic";
import newsRouter from "./news-topic";

const router = Router();

router.use(polymarketRouter);
router.use(xRouter);
router.use(newsRouter);

export default router;
