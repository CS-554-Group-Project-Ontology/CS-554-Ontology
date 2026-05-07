import { z } from "zod";

export const PolymarketEventSchema = z.object({
  id: z.string().trim(),
  slug: z.string().trim(),
  title: z.string().trim(),
  description: z.string().trim(),
  startDate: z.string().trim(),
  endDate: z.string().trim(),
  active: z.boolean().default(true),
  closed: z.boolean(),
  liquidity: z.number().min(0),
  volume: z.number().min(0),
  category: z.string().optional(),
  subcategory: z.string().trim().optional(),
  yesPrice: z.number().optional(),
  bestBid: z.number().optional(),
  bestAsk: z.number().optional(),
  oneDayPriceChange: z.number().optional(),
});
export type PolymarketEvent = z.infer<typeof PolymarketEventSchema>;

export const XMediaSchema = z.object({
  media_key: z.string().trim(),
  type: z.literal("photo"),
  preview_image_url: z.string().optional(),
  url: z.string().trim(),
  width: z.number().min(1),
  height: z.number().min(1),
});
export type XMedia = z.infer<typeof XMediaSchema>;

export const NewsArticleEntrySchema = z.object({
  title: z.string().trim(),
  sourceUrl: z.string().trim(),
  publishedAt: z.string().trim(),
  authors: z.array(z.string().trim()),
  summary: z.string().trim(),
});
export type NewsArticleEntry = z.infer<typeof NewsArticleEntrySchema>;

export const XTweetSchema = z.object({
  id: z.string().trim(),
  author_id: z.string().trim(),
  username: z.string().trim(),
  name: z.string().trim(),
  text: z.string().trim(),
  created_at: z.string().trim(),
  profile_image_url: z.string().trim(),
  verified: z.boolean(),
  public_metrics: z.object({
    retweet_count: z.number().min(0),
    reply_count: z.number().min(0),
    like_count: z.number().min(0),
    quote_count: z.number().optional(),
    impression_count: z.number().optional(),
  }),
  media: z.array(XMediaSchema),
});
export type XTweet = z.infer<typeof XTweetSchema>;
