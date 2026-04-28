import axios from "axios";
import { appendToNewsStream } from "./streams_config.ts";
import { clearNewsStream } from "./streams_config.ts";
import * as z from "zod";
import type Redis from "ioredis";

const alphaApiKey = process.env.ALPHA_VANTAGE_KEY;






interface AlphaVantageNewsArticleRaw {
  title: string;
  url: string;
  time_published: string;     
  authors?: string[];
  summary: string;
  banner_image?: string | null; 
}

interface AlphaVantageResponse{ 
  feed:AlphaVantageNewsArticleRaw[]; 
}

const finalArticleSchema = z.object({ 
  title: z.string().trim().min(0),
  sourceUrl: z.string().trim().url(), 
  publishedAt: 
  z.string()
  .regex(/^\d{8}T\d{6}$/)
  .transform((s) => {
    const dateConversion = `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`
    return new Date(dateConversion)

}),
  authors: z.array(z.string().trim()).min(0), 
  summary: z.string().trim().min(0)

})

export type FinalNewsArticle = z.infer<typeof finalArticleSchema>


function toNewsArticle(rawNewsData: AlphaVantageNewsArticleRaw): FinalNewsArticle{
  return finalArticleSchema.parse({ 
    title: rawNewsData.title, 
    sourceUrl: rawNewsData.url, 
    publishedAt: rawNewsData.time_published,
    authors: rawNewsData.authors, 
    summary: rawNewsData.summary, 
  })
}




function serializeForStream(article: FinalNewsArticle): Record<string, string> {
  return { data: JSON.stringify(article) };
}






export async function fetchAlphaVantageNews(redis: Redis): Promise<number> {
  try {
    await clearNewsStream(redis);

    const response = await axios.get<AlphaVantageResponse>(
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

    const rawArticles = response.data.feed ?? [];


    if (rawArticles.length === 0) {
      throw new Error("Alpha Vantage returned no articles");
    }

    const validatedArticles: FinalNewsArticle[] = [];

    for (const articles of rawArticles) {
      try {
        validatedArticles.push(toNewsArticle(articles));
      } 
      catch (error) {
        console.log(`Given invalid article was skipped that has the following url: ${articles.url}:`, error);
      }
    }

    let appendedCount = 0;

    for(const article of validatedArticles){
      await appendToNewsStream(redis, serializeForStream(article));
      appendedCount += 1; 

    }

    console.log(`Alpha Vantage: appended ${appendedCount} new articles (${validatedArticles.length} validated of ${rawArticles.length} received)`);
    return appendedCount;
  } 
  catch (error) {
    throw new Error(`Failed to fetch economic data from Alpha Vantage: ${error}`);
  }
}

