import type Redis from "ioredis";

export const NEWS_STREAM = "news:feed"; // redis streams key 
const MAX_STREAM_LENGTH = 400; 


export async function trimNewsStreamEntriesOlderThan(redis: Redis, maximumAgeMilliseconds: number ): Promise<number> {
  try{ 
    const cutOffTimestamp = Date.now() - maximumAgeMilliseconds;  

    const minimumEntryIdToKeep = `${cutOffTimestamp}-0`

    const removedEntries = await redis.xtrim(NEWS_STREAM,"MINID","=",minimumEntryIdToKeep)

    return removedEntries; 


  }
  catch(error){
    throw new Error(`Failed to remove older news entries from alpha vantage due to the following error: ${error}`)
  }
}

/* 

- This might need to be used in case we need to clear the stream when testing the final version of the project
export async function clearNewsStream(redis: Redis): Promise<void> {
  await redis.xtrim(news_stream, "MAXLEN", max_stream_length);
}
*/ 

export interface NewsStreamEntry{
  id: string;
  fields: Record<string, string>;
};



export async function appendToNewsStream(redis: Redis, fields: Record<string, string>): Promise<string> {
  try{
    const newsEntry = await redis.xadd(NEWS_STREAM, "MAXLEN","=", MAX_STREAM_LENGTH,"*",...Object.entries(fields).flat(),);
    
    if (!newsEntry) {
      throw new Error(`Failed to append article to ${NEWS_STREAM} the xdd operation  returned null`);
    }

    return newsEntry;
  }
  catch(error){ 
    throw new Error(`Failed to write to Redis log due the following error ${error}`); 
  }
}


export async function readNewsStreamSince(redis: Redis, lastId: string = "0", count: number = 15): Promise<NewsStreamEntry[]> {
  try{
    let start = "-"; 

    if(lastId !== "0"){ 
      start = `(${lastId}`;
    }


    const rawData = await redis.xrange(NEWS_STREAM, start, "+", "COUNT",count,);

    return rawData.map(([id, pairs]) => ({ 
      id, fields: pairsToObject(pairs) 
    }));
  }
  catch(error){
    throw new Error(`Failed to read from the news stream: ${error}`);
  }
}



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




