import Redis from "ioredis";
import { fetchAlphaVantageNews } from "./src/streams/producers.ts";


 function redisRailwayConnect(){ 
  try{

    const redisUrl = process.env.REDIS_URL; 

    if(!redisUrl){ 
      throw new Error("The proper redis url key from Railway has not been set");

    }

    return new Redis(redisUrl, {
      maxRetriesPerRequest: 1 

    })
  } 
  catch(error){ 
    throw new Error(`Failed to connect Redis Railway Instance due to the following error: ${error}`); 
  }
  
}


async function runProducer(redis: Redis): Promise<void>{ 

  try{
    const appendedEntry = await fetchAlphaVantageNews(redis);

    console.log(`The following ${appendedEntry} have been added to the redis log`);

  } 
  catch(error){ 
    throw new Error(`Failed to run the producer due to the following error: ${error}`); 
  }

}



async function main(): Promise<void> {
  const redis = redisRailwayConnect();  
  try {
    await redis.ping();

    console.log(`You have succesfully connected to the Redis Instance on Railway`)

    await runProducer(redis)


  }
  finally {
    await redis.quit();
  }
}

main();
