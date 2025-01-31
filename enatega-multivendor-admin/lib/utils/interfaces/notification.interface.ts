import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { IFilterType } from './table.interface';

export interface INotification {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface IGetNotification {
  notifications: INotification[];
}

export interface INotificationFormProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
}

export interface INotificationTableProps {
  onGlobalFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  filters: IFilterType | undefined;
  globalFilterValue: string;
}

export interface INotificationHeaderProps {
  handleButtonClick: () => void;
}

export interface IGetNotifications {
  notifications: INotification[];
}

export interface IWebNotification {
  __typename: 'WebNotification';
  _id: string;
  body: string;
  navigateTo: string | null;
  read: boolean;
  createdAt: string;
}

// Define the structure of the query result object
export interface INotificationsDataResponse {
  webNotifications: IWebNotification[];
}
