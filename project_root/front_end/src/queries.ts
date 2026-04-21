import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    getMe {
      _id
      UUID
      createdAt
      updatedAt
      economic_profile {
        city
        neighborhood
        income
        liabilities {
          insuranceDeductibles
          rent
          utilities
          other
        }
      }
    }
  }
`;

export const FRED_SERIES = gql`
  query FredSeries($seriesId: String!, $start: String, $end: String) {
    fredSeries(seriesId: $seriesId, start: $start, end: $end) {
      seriesId
      observations {
        date
        value
      }
    }
  }
`;

const queries = {
  GET_ME,
  FRED_SERIES,
};

export default queries;
