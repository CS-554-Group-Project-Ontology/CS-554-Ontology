// News.tsx
import { useEventStream } from "./useEventStream";
import { toTweet, toPolymarketRow, toNewsArticle } from "./transformers";
import type { Tweet, NewsArticle, PolymarketRow } from "./transformers";
import {
  XTweetSchema,
  NewsArticleEntrySchema,
  PolymarketEventSchema,
} from "./Inputs";
import TwitterSidebar from "./subcomponents/TwitterSidebar";
import ActiveNewsPanel from "./subcomponents/ActiveNews";
import PolymarketPanel from "./subcomponents/Polymarketpanel";

const getTweetId = (t: Tweet) => t.id;
const getArticleId = (a: NewsArticle) => a.id;
const getMarketId = (p: PolymarketRow) => p.id;

const News = () => {
  const tweets = useEventStream({
    url: "/streams/x",
    events: {
      snapshot: "snapshot",
      update: "tweetAdded",
    },
    schema: XTweetSchema,
    transform: toTweet,
    getId: getTweetId,
  });

  const articles = useEventStream({
    url: "/stream/alpha-vantage-news",
    events: {
      snapshot: "snapshot",
      update: "articleAdded",
    },
    schema: NewsArticleEntrySchema,
    transform: toNewsArticle,
    getId: getArticleId,
  });

  const polymarket = useEventStream({
    url: "/stream/polymarket",
    events: {
      snapshot: "snapshot",
      update: "marketUpdated",
    },
    schema: PolymarketEventSchema,
    transform: toPolymarketRow,
    getId: getMarketId,
  });

  return (
    <div className="h-screen flex flex-col">
      <div className="px-6 py-4 border-b border-base-content/10">
        <h1 className="text-xl font-bold">News Page</h1>
        <p className="text-sm text-base-content/60">
          Live updates on world events and prediction market data on the likelihood of future outcomes.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-[320px_1fr] gap-4 p-4 min-h-0">
        <TwitterSidebar tweets={tweets} />
        <div className="grid grid-rows-2 gap-4 min-h-0">
          <ActiveNewsPanel articles={articles} />
          <PolymarketPanel events={polymarket} />
        </div>
      </div>
    </div>
  );
};

export default News;
