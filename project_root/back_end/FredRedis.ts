import { client } from "./Config/redisClient.ts"

const FredTTL = 60 * 60 * 24

function keyFor(seriesId: string, start?: string, end?: string){
    return `fred:${seriesId}:${start ?? ''}:${end ?? ''}`;
}

export async function getFredCache(seriesId: string, start?: string, end?: string){
    const raw = await client.get(keyFor(seriesId, start, end));
    return raw ? JSON.parse(raw) : null;
}

export async function setFredCache(seriesId: string, observations: unknown, start?: string, end?: string){
    await client.set(
        keyFor(seriesId, start, end),
        JSON.stringify(observations),
        { EX: FredTTL }
    );
}
