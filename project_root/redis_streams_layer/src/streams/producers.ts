import axios from "axios";
import { appendToNewsStream } from "./streams_config.ts";
import { trimNewsStreamEntriesOlderThan } from "./streams_config.ts";
import * as z from "zod";
import type Redis from "ioredis";


const alphaApiKey = process.env.ALPHA_VANTAGE_KEY;
const ONE_DAY_MS = 24 * 60 * 60 * 1000; 




const finalArticleSchema = z.object({ 
  title: z.string().trim().min(0),
  sourceUrl: z.string().trim().url(), 
  publishedAt: 
  z.string().trim()
  .regex(/^\d{8}T\d{6}$/)
  .transform((s) => {
    const dateConversion = `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`
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
      throw new Error("Alpha Vantage returned no articles");
    }

    const validatedArticles: FinalNewsArticle[] = [];
    const malformedArticles = []; 

    for (const article of rawArticles) {
      try {
        validatedArticles.push(toNewsArticle(article));
      } 
      catch (error) {
        console.log("Given invalid article was skipped:", article);
        malformedArticles.push(article); 

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

