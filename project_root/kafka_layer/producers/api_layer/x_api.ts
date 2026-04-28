import axios from "axios"; 

const X_TOKEN = process.env.x_bearer_token;
const X_URL = "https://api.x.com/2";



interface xTopics{
  name: string, 
  query: string
}

export const kafkaXTopics: xTopics[] = [{
    name: "cities",
    query: '("San Francisco" OR "New York" OR Houston) lang:en -is:retweet',
  },
  {
    name: "fed",
    query: '("Federal Reserve" OR "interest rates" OR FOMC) lang:en -is:retweet',
  },
  {
    name: "inflation",
    query: '(inflation OR CPI OR "consumer price") lang:en -is:retweet',
  },
];



const latestTweetTopic = new Map<string, string>();


export async function fetchRecentTweets(topicName: string, query: string) {
  try {
    if (!X_TOKEN) {
      throw new Error("x_bearer_token environment variable is not set");
    }

    const validatedQuery = query.trim();


    if (validatedQuery.length === 0) {
      throw new Error("The query string was empty after being trimmed");
    }


    
    const params: Record<string, string> = {
      query: validatedQuery,
      max_results: "100", 
      "expansions": "author_id,attachments.media_keys",
      "tweet.fields": "created_at,public_metrics",
      "user.fields": "name,profile_image_url,verified",
      "media.fields": "type,preview_image_url,url,width,height",
    };

    const sinceId = latestTweetTopic.get(topicName);


    if (sinceId) {
      params.since_id = sinceId;
    }

    const url = `${X_URL}/tweets/search/recent?${new URLSearchParams(params)}`;

    const xGet = await axios.get(url, { headers: { Authorization: `Bearer ${X_TOKEN}` },});

    if (xGet.data.meta.newest_id) {
      latestTweetTopic.set(topicName, xGet.data.meta.newest_id);
    }

    
    return xGet.data;

  }
  catch (error) {
    throw new Error(`Failed to get recent tweets for "${topicName}": ${error}`);
  }
}