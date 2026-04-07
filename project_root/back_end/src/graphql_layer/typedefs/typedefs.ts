


export const typeDefs = `#graphql
  # Graphql cannot infer nested structures
  type UserAuthDetails {
    email: String!
    password: String!
    role: String # Not making it required at first

  }

  type UserEconomicProfile{ 
    income: Number!
    debt: Number!
    neighborhood: String!
    city: String! 
  }

  

  # Setup Queries 
  type Query{ 
    getUserById(id: ID!): User 
    getUserByEmail(email: String!): User

  }


  # Setup Resolvers
  



`;