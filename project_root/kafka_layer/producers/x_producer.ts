import * as z from "zod";
import { producer } from "../config/kafka_manager.ts";
import { fetchRecentTweets } from "./api_layer/x_api.ts";
import { kafkaXTopics } from "./api_layer/x_api.ts";


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
  type: z.enum(["photo", "video", "animated_gif"]),
  preview_image_url: z.string().optional(),
  url: z.string().trim().min(1),
  width: z.number().nonnegative().min(1),
  height: z.number().nonnegative().min(1),
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
      retweet_count: z.number().nonnegative().min(0),
      reply_count: z.number().nonnegative().min(0),
      like_count: z.number().nonnegative().min(0),
      quote_count: z.number().nonnegative().min(0).optional(),
      impression_count: z.number().nonnegative().min(0).optional(),
    }),
  media: z.array(finalXMediaSchema).default([]),
});

type FinalXTweet = z.infer<typeof finalXTweetSchema>;





// Interface Layers for needed X data inside of kafka topics
interface RawXPublicMetrics {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  impression_count: number;
}


interface RawXMedia {
  media_key: string;
  type: "photo" | "video" | "animated_gif";
  preview_image_url: string;
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
    media_keys: string[];
  };
}

interface RawXResponse {
  data: RawXTweet[];
  includes: {
    users: RawXUser[];
    media: RawXMedia[];
  };
  meta: {
    newest_id: string;
    result_count: number;
  };
}






export async function TwitterProducer() {
  for (const topic of kafkaXTopics) {
    try {
      const response = (await fetchRecentTweets(topic.name, topic.query)) as RawXResponse; // Given Raw API Repsonse 
      const tweets = response.data ?? [];
      const users = response.includes?.users ?? [];
      const media = response.includes?.media ?? [];

      if (tweets.length === 0) {
        continue;
      }

      const userById = new Map<string, RawXUser>(); 

      for(const user of users){
        userById.set(user.id,user); 
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
          console.log(`Skipping invalid tweet ${tweet.id} from the following topic${topic.name} due to this error:`, error);
        }
      }

      const messages = formatted.map((tweet) => ({
        key: tweet.id,
        value: JSON.stringify(tweet),
      }));

      await producer.send({
        topic: "x-news-feed",
        messages,
      });
    }
    catch (error) {
      console.log(`The following topic: "${topic.name}" that was passed in failed continuing to next:`, error);
    }
  }
}
