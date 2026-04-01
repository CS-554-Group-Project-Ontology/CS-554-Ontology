import {gql} from "graphql-tag";

export const typeDefs = gql `
    type Query {
        users: [User!]!
        getUserByID(_id: String!): User  
    }

    type User {
        _id: String
        UUID: String!
        createdAt: String
        updatedAt: String
        economic_profile: EconomicProfile
    }

    type EconomicProfile {
        income: Float
        address: String
        Liabilities: Liabilities
    }

    type Liabilities {
        rent: Float
        insuranceDeductibles: Float
        utilities: Float
        other: Float
    }

    type Mutation {
        
        addUser(
            UUID: String!
            createdAt: String
            updatedAt: String
            economic_profile: EconomicProfile
        ): User
        
        editUser(
            _id: String!,
            UUID: String!
            createdAt: String
            updatedAt: String
            economic_profile: EconomicProfile
        ): User

        updateEconomicProfile(
            _id: String!
            income: Float
            address: String
            Liabilities: Liabilities
        ): User
        
        removeUser(_id: String!): User
    }
`;