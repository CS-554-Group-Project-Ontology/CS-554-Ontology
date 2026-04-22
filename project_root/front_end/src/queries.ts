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

export const GET_COST_OF_LIVING_BY_CITY_AND_NEIGHBORHOOD = gql`
  query GetCostOfLivingByCityAndNeighborhood($city: String!, $neighborhood: String!) {
    getCostOfLivingByCityAndNeighborhood(city: $city, neighborhood: $neighborhood) {
      rent
      insuranceDeductibles
      utilities
      other
    }
  }
`;

const queries = {
  GET_ME,
  GET_COST_OF_LIVING_BY_CITY_AND_NEIGHBORHOOD,
};

export default queries;
