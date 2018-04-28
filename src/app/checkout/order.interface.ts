import { Observable } from "rxjs/Observable";

export interface Order {
  uid?: string;
  id?: string;
  nonce?: string;
  token$?: Observable<string>;
  quantity?: number;
  subtotal?: number;
  shippingCost?: number;
  total?: number;
  customerId?: string;
  product?: string;
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
  pdfUrl?: string;
}