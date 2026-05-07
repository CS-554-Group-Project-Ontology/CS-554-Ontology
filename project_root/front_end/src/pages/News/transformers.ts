import type {
  XTweet,
  PolymarketEvent,
  NewsArticleEntry,
} from "./Inputs";

export const toTweet = (t: XTweet) => ({
  id: t.id,
  author: {
    name: t.name,
    avatarUrl: t.profile_image_url,
    verified: t.verified,
  },
  content: t.text,
  timestamp: t.created_at,
  stats: {
    likes: t.public_metrics.like_count,
    retweets: t.public_metrics.retweet_count,
  },
});

export const toPolymarketRow = (p: PolymarketEvent) => ({
  id: p.id,
  question: p.title,
  yesPrice: p.yesPrice ?? 0,
  change24h: p.oneDayPriceChange ?? 0,
  volume: p.volume,
});

export const toNewsArticle = (a: NewsArticleEntry) => ({
  id: a.sourceUrl,
  source: new URL(a.sourceUrl).hostname.replace(/^www\./, ""),
  timestamp: a.publishedAt,
  headline: a.title,
  summary: a.summary,
});

export type Tweet = ReturnType<typeof toTweet>;
export type PolymarketRow = ReturnType<typeof toPolymarketRow>;
export type NewsArticle = ReturnType<typeof toNewsArticle>;
