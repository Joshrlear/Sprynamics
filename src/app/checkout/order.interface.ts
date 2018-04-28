import { Observable } from "rxjs/Observable";

export interface Order {
  uid?: string;
  id?: string;
  nonce?: string;
  token?: string;
  quantity?: number;
  subtotal?: number;
  shippingCost?: number;
  total?: number;
  customerId?: string;
  product?: string;
  firstName?: string;
  lastName?: string;
  shipping?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
  }
  createdAt?: any;
  submitted?: boolean;
  propertyAddress?: any;
  isMailingList?: boolean;
  mailingListId?: string;
  pdfUrl?: string;
}