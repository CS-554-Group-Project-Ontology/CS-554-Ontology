import connectDB from './Config/mongooseConfig.ts';
import { typeDefs } from './data/userTypeDefs.ts';
import { userResolver } from './data/userResolver.ts';
import { fredTypeDefs } from './data/fredTypeDefs.ts';
import { fredResolver } from './data/fredResolver.ts';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { fredClient, authClient } from "./Config/redisClient.ts"

await fredClient.connect();
await authClient.connect();

const Server = async () => {
    await connectDB();

    const server = new ApolloServer({
        typeDefs: [typeDefs, fredTypeDefs],
        resolvers: [userResolver, fredResolver]
    });

    const { url } = await startStandaloneServer(server,{
        context: async ({req}) => {
            
                const authHeader = req.headers.authorization || "";

                if (!authHeader.startsWith("TokenHolder ")){
                    return { token: ""};
                }

                const token = authHeader.replace("TokenHolder ", "");
                return { token };
            },
        listen: { port: Number(process.env.PORT) || 4000},
        });
        console.log(`Server running at ${url}`);
} 

Server();
