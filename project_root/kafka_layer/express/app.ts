import express from "express";
import cors from "cors";
import router from "./routes";

export function startExpressServer() {
  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use(router);

  app.listen(PORT, () => {
    console.log(`Express server listening on :${PORT}`);
  });
}
