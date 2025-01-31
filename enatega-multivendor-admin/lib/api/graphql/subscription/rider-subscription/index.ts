import { gql } from '@apollo/client';

export const RIDER_UPDATED_SUBSCRIPTION = gql`
  subscription RiderUpdated {
    riderUpdated {
      _id
      name
      vehicleDetails {
        number
        image
      }
    }
  }
`;
