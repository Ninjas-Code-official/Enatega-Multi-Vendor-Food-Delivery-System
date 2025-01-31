// Interfaces
import { TSideBarFormPosition } from '../types/sidebar';
import { IGlobalComponentProps } from './global.interface';

export interface IRiderResponseZone {
  __typename: 'Zone';
  _id: string;
  title: string;
}

export interface IRiderResponse {
  __typename: 'Rider';
  _id: string;
  name: string;
  username: string;
  password: string;
  phone: string;
  available: boolean;
  assigned: string[];
  zone: IRiderResponseZone;
}

export interface ISingleRiderResponse {
  __typename: 'Rider';
  _id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  available: boolean;
  assigned: string[];
  zone: IRiderResponseZone;
  bussinessDetails: IBusinessDetails;
  licenseDetails: ILicenseDetails;
  vehicleDetails: IVehicleDetails;
}

export interface IBusinessDetails {
  bankName: string;
  accountName: string;
  accountCode: string;
  accountNumber: number;
  businessRegNo: number;
  companyRegNo: number;
  taxRate: number;
}

export interface ILicenseDetails {
  number: string;
  expiryDate: string; // ISO date string (e.g., "2024-12-31T00:00:00Z")
  image: string;
}

export interface IVehicleDetails {
  number: string;
  image: string;
}

// Define the structure of the query result object
export interface IRidersDataResponse {
  riders: IRiderResponse[];
}

export interface IRiderDetailDataResponse {
  rider: ISingleRiderResponse;
}

export interface IRidersHeaderComponentsProps extends IGlobalComponentProps {
  setIsAddRiderVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IRidersMainComponentsProps extends IGlobalComponentProps {
  setIsAddRiderVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setRider: React.Dispatch<React.SetStateAction<IRiderResponse | null>>;
}

export interface IRidersAddFormComponentProps extends IGlobalComponentProps {
  position?: TSideBarFormPosition;
  isAddRiderVisible: boolean;
  onHide: () => void;
  rider: IRiderResponse | null;
}

export interface IRiderHeaderProps extends IGlobalComponentProps {
  setIsAddRiderVisible: (visible: boolean) => void;
}
export interface IRidersTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export interface IRiderReponse {
  _id: string;
  name: string;
  username: string;
  password: string;
  phone: string;
  available: boolean;
  zone: {
    _id: string;
    title: string;
    __typename: 'Zone';
  };
  __typename: 'Rider';
}

export interface IRidersResponseGraphQL {
  riders: IRiderReponse[];
}

export interface IRiderDetailsProps {
  loading: boolean;
  rider: ISingleRiderResponse | undefined;
}
