import express from "express";
import router from "./routes";

export function startExpressServer() {
  const app = express();
  app.disable('x-powered-by');
  const PORT  = process.env.PORT || 3001;

  app.use(express.json());

  app.get("/health", (_req, res) =>res.json({ ok: true }));

  app.use(router); 

  app.listen(PORT, () => {
    console.log(`Express server listening on :${PORT}`);
  });
}
