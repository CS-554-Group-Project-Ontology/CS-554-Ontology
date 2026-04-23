import axios from "axios";
import { appendToNewsStream } from "./streams_config.ts";
import { redis } from "../config/redis.ts";


const alphaApiKey = process.env.alpha_vantage_key;
const alphaUrl: string = "https://www.alphavantage.co/query";
const DEDUP_TTL_SECONDS = 60 * 60 * 24 * 7;




// Type Declaration (should I use the type or interface to structure API Data)
interface AlphaVantageNewsArticle{
  title: string;
  url: string;
  time_published: string;
  summary: string;
  source: string;
  topics: Array<{ topic: string; relevance_score: string }>;

}

interface AlphaVantageApiResponse {
  items?: string;           
  sentiment_score_definition?: string;
  relevance_score_definition?: string;
  feed?: AlphaVantageNewsArticle[];
}



/*
API Parameters

https://www.alphavantage.co/documentation/
Required: function

The function of your choice. In this case, function=NEWS_SENTIMENT

Optional: tickers

The stock/crypto/forex symbols of your choice. For example: tickers=IBM will filter for articles that mention the IBM ticker; tickers=COIN,CRYPTO:BTC,FOREX:USD will filter for articles that simultaneously mention Coinbase (COIN), Bitcoin (CRYPTO:BTC), and US Dollar (FOREX:USD) in their content.

Optional: topics


// Topics 
The news topics of your choice. For example: topics=technology will filter for articles that write about the technology sector; topics=technology,ipo will filter for articles that simultaneously cover technology and IPO in their content. Below is the full list of supported topics:

Blockchain: blockchain
Earnings: earnings
IPO: ipo
Mergers & Acquisitions: mergers_and_acquisitions
Financial Markets: financial_markets
Economy - Fiscal Policy (e.g., tax reform, government spending): economy_fiscal
Economy - Monetary Policy (e.g., interest rates, inflation): economy_monetary
Economy - Macro/Overall: economy_macro
Energy & Transportation: energy_transportation
Finance: finance
Life Sciences: life_sciences
Manufacturing: manufacturing
Real Estate & Construction: real_estate
Retail & Wholesale: retail_wholesale
Technology: technology


Optional: time_from and time_to

The time range of the news articles you are targeting, in YYYYMMDDTHHMM format. For example: time_from=20220410T0130. If time_from is specified but time_to is missing, the API will return articles published between the time_from value and the current time.

Optional: sort

By default, sort=LATEST and the API will return the latest articles first. You can also set sort=EARLIEST or sort=RELEVANCE based on your use case.

Optional: limit

By default, limit=50 and the API will return up to 50 matching results. You can also set limit=1000 to output up to 1000 results.

- apikey

*/
export async function fetchAlphaVantageNews(): Promise<number> {
  try {
    const alphaVantageResponse = await axios.get<AlphaVantageApiResponse>(alphaUrl,{
        params: {
          function: "NEWS_SENTIMENT",
          topics: "economy_monetary",
          limit: 25,
          apikey: alphaApiKey,
        },
      },
    );

    const newsArticlesData = alphaVantageResponse.data.feed ?? [];

    if (newsArticlesData.length === 0) {
      throw new Error(" Alpha Vantage returned no articles ");
    }

    let appendedArticles = 0;

    for (const newsArticle of newsArticlesData) {
      const dedupKey = `news:seen:${newsArticle.url}`;

      const claimResult = await redis.set(dedupKey, "1", "EX", DEDUP_TTL_SECONDS, "NX");

      if (claimResult !== "OK") {
        continue;
      }

      await appendToNewsStream({
        title: newsArticle.title ?? "",
        url: newsArticle.url ?? "",
        time_published: newsArticle.time_published ?? "",
        summary: newsArticle.summary ?? "",
        source: newsArticle.source ?? "",
        topics: JSON.stringify(newsArticle.topics ?? []),
      });

      appendedArticles += 1;
    }

    console.log(`Alpha Vantage inserted the following ${appendedArticles} new items (${newsArticlesData.length} were received and appended to the log`,);


    return appendedArticles;
  }
  catch (error) {
    throw new Error(`Failed to fetch economic data from alphaVantage due to the following error: ${error}`,);
  }
}


