import { gql } from "graphql-tag";

export const fredTypeDefs = gql`
    extend type Query {
        fredSeries(seriesId: String!, start: String, end: String): FredSeries!
    }

    type FredSeries {
        seriesId: String!
        observations: [FredObservation!]!
    }

    type FredObservation {
        date: String!
        value: Float
    }
`;
