/*
- https://docs.polymarket.com/concepts/markets-events
- https://docs.polymarket.com/api-reference/events/list-events
*/


// Publically avaiable endpoint so value does not need to be stored within the env file
const gamma_api = "https://gamma-api.polymarket.com";

export async function gammaFetch(endpoint: string, queryParams?: Record<string, string>) {
  try {
    if(!endpoint || !queryParams){ 
      throw new Error("One of the input arguements is not defined"); 
    }

    let validatedEndpoint: string = endpoint.trim();
    
    if(validatedEndpoint.length === 0){ 
      throw new Error("The given endpoint is empty after it was trimmed"); 
    }


    const url = new URL(`${gamma_api}${validatedEndpoint}`);

    

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (!key.trim() || !value.trim()) {
          throw new Error("Parameter key and value must not be empty");
        }
      }
    }

    const res = await fetch(url.toString());

    if (!res.ok) {
      throw new Error(`Polymarket Gamma error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } 
  catch (error) {
    throw new Error(`gammaFetch failed for due to the following error: ${error}`);
  }
}

export async function fetchPoliticalEvents(limit: number = 30 , skipCounter = 0) {
  try {
    const PoliticalData = await gammaFetch("/events", {
      tag: "Politics",
      limit: String(limit),
      offset: String(skipCounter),
      active: "true",
      closed: "false",
    });

    if(!PoliticalData){
      throw new Error("No data returned from the given api call"); 
    }

    console.log(PoliticalData);

    return PoliticalData;
  } 
  catch (error) {
    throw new Error(`Policital events function failed due to the following error: ${error}`);
  
  }
}

export async function fetchEventBySlug(slug: string) {
  try {
    if(!slug){ 
      throw new Error("The given string is null or undefined"); 
    }

    let validatedSlug: string = slug.trim(); 

    if(validatedSlug.length === 0){ 
      throw new Error("The slug is empty after trimming"); 
    }


    const eventsSlug = await gammaFetch(`/events/slug/${slug}`);

    return eventsSlug;
  } 
  catch (error) {
    throw new Error(`The function failed due to the following error: ${error}`);
  }
}

export async function fetchMarketById(conditionId: string) {
  try {
    const GammaMarketData = await gammaFetch(`/markets/${conditionId}`);

    if(!GammaMarketData){
      throw new Error(`The given data failed to be fetched from the gamma endpoint`)
    }

    return GammaMarketData;
  } 
  catch (error) {
    throw new Error(`Failed to fetch the given market because of the given error: ${error}`);
  
  }
}

export async function PolymarketMain() {
  try {
    const events = await fetchPoliticalEvents();

    console.log(events); 

    return events;
  }
  catch (error) {
    throw new Error(`PolymarketMain failed for the given reason: ${error}`);
  }
}

PolymarketMain();
