import type Redis from "ioredis";

export const news_stream = "news:feed";
const max_stream_length = 1000;




export async function clearNewsStream(redis: Redis): Promise<void> {
  await redis.xtrim(news_stream, "MAXLEN", "~", 0);
}

export type NewsStreamEntry = {
  id: string;
  fields: Record<string, string>;
};



export async function appendToNewsStream(redis: Redis, fields: Record<string, string>,): Promise<string> {
  try{
    const newsEntry = await redis.xadd(news_stream, "MAXLEN","~", max_stream_length,"*",...Object.entries(fields).flat(),);
    
    if (!newsEntry) {
      throw new Error(`Failed to the given article to thew ${news_stream} returned null`);
    }

    return newsEntry;
  }
  catch(error){ 
    throw new Error(`Failed to write to Redis log due the following error ${error}`); 
  }
}


export async function readNewsStreamSince(redis: Redis, lastId: string = "0", count: number = 200,): Promise<NewsStreamEntry[]> {
  try{
    let start = "-"; 

    if(lastId !== "0"){ 
      start = `(${lastId})`;
    }


    const rawData = await redis.xrange(
      news_stream,
      start,
      "+",
      "COUNT",
      count,
    );

    return rawData.map(([id, pairs]) => ({ 
      id, fields: pairsToObject(pairs) }));
  }
  catch(error){
    throw new Error(`Failed to read from the news stream: ${error}`);
  }
}



// Helper for formatting Redis Data
export function pairsToObject(pairs: string[]): Record<string, string> {
  const obj: Record<string, string> = {};

  for (let i = 0; i < pairs.length; i += 2) {
    const key = pairs[i];

    const value = pairs[i + 1];

    if (key !== undefined && value !== undefined) {
      obj[key] = value;
    }
  }
  return obj;
}




