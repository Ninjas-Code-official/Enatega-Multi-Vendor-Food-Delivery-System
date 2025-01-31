import { gql } from '@apollo/client';

export const SEND_NOTIFICATION_USER = gql`
  mutation SendNotificationUser(
    $notificationTitle: String
    $notificationBody: String!
  ) {
    sendNotificationUser(
      notificationTitle: $notificationTitle
      notificationBody: $notificationBody
    )
  }
`;

export const MARK_WEB_NOTIFICATIONS_AS_READ = gql`
  mutation MarkWebNotificationsAsRead {
    markWebNotificationsAsRead {
      _id
      body
      navigateTo
      read
      createdAt
    }
  }
`;
