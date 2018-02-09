import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutComponent } from './checkout.component';
import { ShippingComponent } from './shipping/shipping.component';
import { PaymentComponent } from './payment/payment.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';

@NgModule({
  imports: [
    CommonModule,
    CheckoutComponent,
    ShippingComponent,
    PaymentComponent,
    ConfirmComponent
  ],
  declarations: [
    CheckoutComponent,
    ShippingComponent,
    PaymentComponent,
    ConfirmComponent,
    OrderSummaryComponent
  ]
})
export class CheckoutModule { }
