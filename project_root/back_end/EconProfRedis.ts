import { authClient } from "./Config/redisClient.ts"

const EconTTL = 60 * 15

export async function getCache(UUID: string){
    const raw = await authClient.get(`user:${UUID}`);
    return raw ? JSON.parse(raw) : null;
}

export async function setCache(UUID: string, user: unknown){
    await authClient.set(
        `user:${UUID}`,
        JSON.stringify(user),
        { EX: EconTTL}
    )
}

export async function cleanKey(UUID: string){
    await authClient.del(`user:${UUID}`);
}
