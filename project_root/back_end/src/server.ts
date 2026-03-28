// npx tsc in order to compile the typescript down into javascript 
import { ApolloServer } from "@apollo/server"; 
import { startStandaloneServer} from "@apollo/server/standalone"
import { typeDefs } from "./graphql_layer/typedefs.js";
import {resolvers} from "./graphql_layer/resolvers.js"



const server = new ApolloServer({
    typeDefs,
    resolvers: {

    }
})

async function main(){ 
    try{ 
        
        const {url} = await startStandaloneServer(server,{
            listen: {port: 3001} 

        })

        console.log(`The server is operational on ${url}`); 
 
    }
    catch(error){ 
        console.log("The server failed to start"); 


    }

}


main(); 