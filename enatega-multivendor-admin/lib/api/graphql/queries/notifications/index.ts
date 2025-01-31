import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      id
      body
      title
      createdAt
    }
  }
`;

export const GET_WEB_NOTIFICATIONS = gql`
  query GetWebNotifications {
    webNotifications {
      _id
      body
      navigateTo
      read
      createdAt
    }
  }
`;
