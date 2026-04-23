import { redis } from "./src/config/redis"; 
import { fetchAlphaVantageNews } from "./src/streams/producers";



async function main(): Promise<void> {
  try{
    await redis.ping();
    console.log("Redis-streams on Railway has been reached");

    const appendedEntry = await fetchAlphaVantageNews();

    console.log(`The following ${appendedEntry} have been added to the redis log`);
    
  }
  catch(error){
    throw new Error(`Failed to connect to the redis instance on railway due to the following error: ${error}`);
  }
  finally {
    await redis.quit();
  }
}

main();
