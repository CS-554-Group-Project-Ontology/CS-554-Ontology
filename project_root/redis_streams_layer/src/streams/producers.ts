import axios from "axios";
import { appendToNewsStream, trimNewsStreamEntriesOlderThan, NEWS_STREAM, pairsToObject } from "./streams_config.ts";
import * as z from "zod";
import type Redis from "ioredis";
import type { Producer } from "kafkajs";


const alphaApiKey = process.env.ALPHA_VANTAGE_KEY;
const ONE_DAY_MS = 24 * 60 * 60 * 1000; 
const REDIS_TO_KAFKA_CHECKPOINT = "kafka-mirror:news-feed:last-id";
const KAFKA_NEWS_TOPIC = "news-articles-feed";


const finalArticleSchema = z.object({ 
  title: z.string().trim().min(1),
  sourceUrl: z.string().trim().url(), 
  publishedAt: 
  z.string().trim()
  .regex(/^\d{8}T\d{6}$/)
  .transform((s) => {
    const dateConversion = `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}T${s.slice(9,11)}:${s.slice(11,13)}:${s.slice(13,15)}Z`
    return new Date(dateConversion)

}),
  authors: z.array(z.string().trim()).default([]), 
  summary: z.string().trim().min(0)

})


const alphaVantageFeedResponse = z.object({ 
  feed: z.array(z.unknown()).default([])

})

export type FinalNewsArticle = z.infer<typeof finalArticleSchema>


function toNewsArticle(rawNewsData: unknown): FinalNewsArticle{
  if(typeof rawNewsData !== "object" || rawNewsData === null ){ 
    throw new Error('The given input that is passed in is not an object'); 
  }


  const article = rawNewsData as Record<string, unknown>; 


  return finalArticleSchema.parse({ 
    title: article.title, 
    sourceUrl: article.url, 
    publishedAt: article.time_published,
    authors: article.authors, 
    summary: article.summary, 
  })
}




function serializeForStream(article: FinalNewsArticle): Record<string, string> {
  return { 
    data: JSON.stringify(article) 
  };
}






export async function fetchAlphaVantageNews(redis: Redis): Promise<number> {
  try {
    await trimNewsStreamEntriesOlderThan(redis,ONE_DAY_MS);

    const response = await axios.get<unknown>(
      "https://www.alphavantage.co/query",
      {
        params: {
          function: "NEWS_SENTIMENT",
          topics: "economy_fiscal,economy_monetary,economy_macro",
          limit: 25,
          apikey: alphaApiKey,
        },
      }
    );
  

    const feedResult = alphaVantageFeedResponse.safeParse(response.data); 


    if(!feedResult.success){
      throw new Error(`Malformed Alpha Vantage API response`)

    }

    const rawArticles = feedResult.data.feed;
  


    if (rawArticles.length === 0) {
      console.log("Alpha Vantage returned no articles; skipping this cycle");
      return 0;
    }

    const validatedArticles: FinalNewsArticle[] = [];

    for (const article of rawArticles) {
      try {
        validatedArticles.push(toNewsArticle(article));
      }
      catch (error) {
        console.log("Given invalid article was skipped:", article, error);
      }
    }
    const seenUrls = new Set<string>();

    const dedupedArticles = validatedArticles.filter((article) => {

      if (seenUrls.has(article.sourceUrl)){ 
        return false;
      } 

      seenUrls.add(article.sourceUrl);

      return true;
    });


    let appendedCount = 0;

    for(const article of dedupedArticles){
      await appendToNewsStream(redis, serializeForStream(article));

      appendedCount += 1; 

    }
    
    
    const duplicatesArticlesDropped = validatedArticles.length - dedupedArticles.length;
    console.log(`Alpha Vantage: appended ${appendedCount} new articles (${dedupedArticles.length} unique of ${validatedArticles.length} validated, ${duplicatesArticlesDropped} duplicates dropped, ${rawArticles.length} received)`);


    return appendedCount;
  }
  catch (error) {
    throw new Error(`Failed to fetch economic data from Alpha Vantage: ${error}`);
  }
}


export async function syncRedisStreamToKafka(redis: Redis, kafkaProducer: Producer): Promise<number> {
  try {
    const lastId = (await redis.get(REDIS_TO_KAFKA_CHECKPOINT)) ?? "0";

    const start = lastId === "0" ? "-" : `(${lastId}`;

    const rawEntries = await redis.xrange(NEWS_STREAM, start, "+");

    if (rawEntries.length === 0) {
      return 0;
    }

    const messages = rawEntries.map(([id, pairs]) => {
      const fields = pairsToObject(pairs);

      if (typeof fields.data !== "string") {
        throw new TypeError(`Missing or invalid data field for Redis entry ${id}`);
      }

      return {
        key: id,
        value: fields.data,
      };
    });

    await kafkaProducer.send({
      topic: KAFKA_NEWS_TOPIC,
      messages,
    });

    const newestEntry = rawEntries[rawEntries.length - 1];

    if (!newestEntry) {
      throw new Error("Expected newest Redis stream entry, but found none");
    }

    const newestId = newestEntry[0];

    await redis.set(REDIS_TO_KAFKA_CHECKPOINT, newestId);

    return rawEntries.length;
  } 
  catch (error) {
    throw new Error(`Failed to sync Redis stream to Kafka due to the following error: ${error}`);
  }
}
