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

const queries = {
  GET_ME,
};

export default queries;
