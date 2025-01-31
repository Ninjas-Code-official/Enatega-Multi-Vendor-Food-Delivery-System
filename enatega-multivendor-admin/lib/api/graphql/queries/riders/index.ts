import { gql } from '@apollo/client';

export const GET_RIDERS = gql`
  query riders {
    riders {
      _id
      name
      username
      password
      phone
      available
      assigned
      zone {
        _id
        title
      }
    }
  }
`;

export const GET_RIDER = gql`
  query Rider($id: String!) {
    rider(id: $id) {
      _id
      name
      username
      password
      phone
      available
      assigned
      zone {
        _id
        title
      }
      bussinessDetails {
        bankName
        accountName
        accountCode
        accountNumber
        bussinessRegNo
        companyRegNo
        taxRate
      }
      licenseDetails {
        number
        expiryDate
        image
      }
      vehicleDetails {
        number
        image
      }
    }
  }
`;

export const GET_AVAILABLE_RIDERS = gql`
  query {
    availableRiders {
      _id
      name
      username
      phone
      available
      zone {
        _id
      }
    }
  }
`;
export const GET_RIDERS_BY_ZONE = gql`
  query RidersByZone($id: String!) {
    ridersByZone(id: $id) {
      _id
      name
      username
      phone
      available
      zone {
        _id
        title
      }
    }
  }
`;
