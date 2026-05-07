import { createClient } from "redis";

const fredUrl = process.env.FRED_REDIS_URL;
const authUrl = process.env.AUTH_REDIS_URL;

if (!fredUrl) throw new Error("FRED_REDIS_URL is not set");
if (!authUrl) throw new Error("AUTH_REDIS_URL is not set");

export const fredClient = createClient({ url: fredUrl });
export const authClient = createClient({ url: authUrl });

fredClient.on("error", (err) => console.error("FRED redis error:", err));
authClient.on("error", (err) => console.error("Auth redis error:", err));
