export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LegacyCustomerARequest {
  customerId: number;
  fullName: string;
  emailAddress: string;
}

export interface LegacyCustomerBRequest {
  clientCode: string;
  firstName: string;
  surname: string;
  contact: {
    email: string;
  };
}