import {gql} from "graphql-tag";

export const typeDefs = gql`
  type Query {
    users: [User!]!
    getMe: User
    getCostOfLivingByCityAndNeighborhood(
      city: String!
      neighborhood: String!
    ): Liabilities
  }

  type User {
    _id: ID
    UUID: String!
    economic_profile: EconomicProfile
    createdAt: String
    updatedAt: String
  }

  type EconomicProfile {
    income: Float
    city: String
    neighborhood: String
    liabilities: Liabilities
  }

  type Liabilities {
    rent: Float
    insuranceDeductibles: Float
    utilities: Float
    other: Float
  }

  input InputEconomicProfile {
    income: Float
    city: String
    neighborhood: String
    liabilities: InputLiabilities
  }

  input InputLiabilities {
    rent: Float
    insuranceDeductibles: Float
    utilities: Float
    other: Float
  }

  type Mutation {
        
    addUser: User

        editUser(
            economic_profile: InputEconomicProfile
        ): User

    removeUser: User
  }
`;