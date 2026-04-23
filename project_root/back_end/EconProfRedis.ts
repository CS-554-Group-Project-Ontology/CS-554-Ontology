import { client } from "./Config/redisClient.ts"

const EconTTL = 60 * 15

export async function getCache(UUID: string){
    const raw = await client.get(`user:${UUID}`);
    return raw ? JSON.parse(raw) : null;
}

export async function setCache(UUID: string, user: unknown){
    await client.set(
        `user:${UUID}`,
        JSON.stringify(user),
        { EX: EconTTL}
    )
}

export async function cleanKey(UUID: string){
    await client.del(`user:${UUID}`);
}