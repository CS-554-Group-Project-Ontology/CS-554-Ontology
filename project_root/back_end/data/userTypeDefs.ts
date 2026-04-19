import {gql} from "graphql-tag";

export const typeDefs = gql `
    scalar UUID

    type Query {
        users: [User!]!
        getUserByID(_id: ID!): User  
        getUserByUUID(UUID: UUID!): User  
        
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
        address: String
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
        address: String
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