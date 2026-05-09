import * as z from "zod";
import { producer } from "../config/kafka_manager.ts";
import { fetchRecentTweets, kafkaXTopics } from "./api_layer/x_api.ts";
import { TOPICS } from "../express/routes/constants.ts";


function toXTweet(rawTweet: RawXTweet, rawUser: RawXUser, mediaByKey: Map<string, RawXMedia>,): FinalXTweet {

  const tweetMedia: RawXMedia[] = []; 

  for(const key of rawTweet.attachments?.media_keys ?? []){
    const media = mediaByKey.get(key);

    if(media?.type === "photo"){
      tweetMedia.push(media); 
    }


  }

  return finalXTweetSchema.parse({
    id: rawTweet.id,
    author_id: rawTweet.author_id,
    username: rawUser.username,
    name: rawUser.name,
    text: rawTweet.text,
    created_at: rawTweet.created_at,
    profile_image_url: rawUser.profile_image_url,
    verified: rawUser.verified,
    public_metrics: rawTweet.public_metrics,

    media: tweetMedia.map((media) => ({
      media_key: media.media_key,
      type: media.type,
      preview_image_url: media.preview_image_url,
      url: media.url,
      width: media.width,
      height: media.height,
    })),
  });
}

// Zod Validation
const finalXMediaSchema = z.object({
  media_key: z.string().trim().min(1),
  type: z.literal("photo"),
  preview_image_url: z.string().optional(),
  url: z.string().trim().min(1),
  width: z.number().min(1),
  height: z.number().min(1),
});



const finalXTweetSchema = z.object({
  id: z.string().trim().min(1),
  author_id: z.string().trim().min(1),
  username: z.string().trim().min(1),
  name: z.string().trim().min(1),
  text: z.string().trim().min(1),
  created_at: z.string().trim().min(1),
  profile_image_url: z.string(), // need to get validation for the URL images coming across
  verified: z.boolean().default(false),

  public_metrics: z
    .object({
      retweet_count: z.number().nonnegative(),
      reply_count: z.number().nonnegative(),
      like_count: z.number().nonnegative(),
      quote_count: z.number().nonnegative().optional(),
      impression_count: z.number().nonnegative().optional(),
    }),
  media: z.array(finalXMediaSchema).default([]),
});

const xResponseEnvelope = z.object({
  data: z.array(z.unknown()).default([]),
  includes: z.object({
    users: z.array(z.unknown()).default([]),
    media: z.array(z.unknown()).default([]),
  }).optional(),
  meta: z.object({
    newest_id: z.string().optional(),
    result_count: z.number().optional(),
  }).optional(),
});

type FinalXTweet = z.infer<typeof finalXTweetSchema>;





interface RawXPublicMetrics {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count?: number;
  impression_count?: number;
}


interface RawXMedia {
  media_key: string;
  type: "photo" | "video" | "animated_gif";
  preview_image_url?: string;
  url: string;
  width: number;
  height: number;
}

interface RawXUser {
  id: string;
  username: string;
  name: string;
  profile_image_url: string;
  verified: boolean;
}

interface RawXTweet {
  id: string;
  author_id: string;
  text: string;
  created_at: string;
  public_metrics: RawXPublicMetrics;
  attachments?: {
    media_keys?: string[];
  };
}



export async function TwitterProducer() {
  for (const topic of kafkaXTopics) {
    try {
      const rawResponse = await fetchRecentTweets(topic.name, topic.query);
      
      const parsed = xResponseEnvelope.safeParse(rawResponse);

      if (!parsed.success) {
        console.log(`There was a malformed xv2 api response for the given topic: "${topic.name}":`, parsed.error.issues);
        continue;
      }

      const tweets = parsed.data.data as RawXTweet[];
      const users = (parsed.data.includes?.users ?? []) as RawXUser[];
      const media = (parsed.data.includes?.media ?? []) as RawXMedia[];

      if (tweets.length === 0) {
        continue;
      }

      const userById = new Map<string, RawXUser>(); 

      for(const user of users){
        userById.set(user.id, user);
      }

      const mediaByKey = new Map<string, RawXMedia>();

      for(const mediaItem of media){
        mediaByKey.set(mediaItem.media_key, mediaItem);
      }

      const formatted: FinalXTweet[] = [];

      for (const tweet of tweets) {

        if (!tweet.author_id) {
          continue;
        }

        const xUser = userById.get(tweet.author_id);

        if (!xUser) {
          continue;
        }


        try {
          formatted.push(toXTweet(tweet, xUser, mediaByKey));
        }

        catch (error) {
          console.log(`Skipping invalid tweet ${tweet.id} from the following topic${topic.name} due to this error: ${error}`); 
        }
      }

      const messages = formatted.map((tweet) => ({
        key: tweet.id,
        value: JSON.stringify(tweet),
      }));

      await producer.send({
        topic: TOPICS.TWITTER,
        messages,
      });
    }
    catch (error) {
      console.log(`The x topic that was passed in: "${topic.name}"  was passed in failed continuing to next:`, error);
    }
  }
}
