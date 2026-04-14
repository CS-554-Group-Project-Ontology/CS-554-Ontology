import { gql } from '@apollo/client';

export const GET_USER_BY_UUID = gql`
  query GetUserByUUID($uuid: UUID!) {
    getUserByUUID(UUID: $uuid) {
      _id
      UUID
      createdAt
      updatedAt
      economic_profile {
        address
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

let queries = {
  GET_USER_BY_UUID,
};

export default queries;
