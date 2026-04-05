import connectDB from './Config/mongooseConfig.js';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs } from './data/userTypeDefs.js';
import { userResolver } from './data/userResolver.js';

const Server = async () => {
    await connectDB();

    const server = new ApolloServer({
        typeDefs,
        resolvers: userResolver
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
        listen: { port: 4000},
        });
        console.log(`Server running at ${url}`);
} 

Server();