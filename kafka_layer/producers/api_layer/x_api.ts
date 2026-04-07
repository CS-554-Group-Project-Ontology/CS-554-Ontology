const x_token = process.env.x_bearer_token;


// API endpoint
const x_url = "https://api.x.com/2";

let latestTweet: string | undefined;

async function xFetch(endpoint: string, params: Record<string, string>) {
    try {
        if(!endpoint || !params){ 
            throw new Error("One of the arguments for retriving data is null or undefined"); 
        }

        let validatedEndpoint: string = endpoint.trim(); 

        if(validatedEndpoint.length === 0){
            throw new Error("The given string is empty after being trimmed");  

        }
    
        const url = `${x_url}${endpoint}?${new URLSearchParams(params)}`;

        const Xresponse = await fetch(url, {
            headers: { Authorization: `Bearer ${x_token}` },
        });


        if (!Xresponse.ok) {
            throw new Error("Failed to fetch the given resources from the xapi");
        }

        return Xresponse.json();
    }
    catch(error) {
        throw new Error(`The data failed to return from X due to the following error ${error}`);
        
    }
}


export async function fetchRecentTweets(query: string) {
    try {

        if(!query){
            throw new Error("The givent query is undefined or null"); 
        }


        let validatedQuery:string = query.trim(); 


        if(validatedQuery.length === 0){ 
            throw new Error("The string was empty after it was trimmed"); 
        }
        const params: Record<string, string> = {
            query,
            max_results: "10",
            "tweet.fields": "created_at,author_id,text,public_metrics",
        };

        if (latestTweet) {
            params.since_id = latestTweet;
        }

        const data: any = await xFetch("/tweets/search/recent", params);

        if (data.meta?.newest_id) {
            latestTweet = data.meta.newest_id;
        }

        // console.log(data.data); 

        return data.data ?? [];
    }
    catch(error) {
        throw new Error(`Failed to get recent tweets due to the following error ${error}`);
    }
}


async function Xmain(){ 
    try{ 
        fetchRecentTweets("Trump Administration"); 

    }
    catch(error){
        throw new Error(`The recent tweet test failed due to the following error: ${error}`);
    }
}

Xmain();
