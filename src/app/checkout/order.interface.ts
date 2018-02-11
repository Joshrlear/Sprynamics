import { Observable } from "rxjs/Observable";

export interface Order {
  orderId?: number;
  token$?: Observable<string>;
  quantity?: number;
  subtotal?: number;
  shippingCost?: number;
  total?: number;
  customerId?: string;
  shipping?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
  }
}