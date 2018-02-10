import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '#app/shared/shared.module';

import { CheckoutComponent } from './checkout.component';
import { ShippingComponent } from './shipping/shipping.component';
import { PaymentComponent } from './payment/payment.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';

const routes: Routes = [
  { path: '', redirectTo: 'shipping-info', pathMatch: 'full' },
  { path: 'shipping-info', component: ShippingComponent },
  { path: 'payment-method', component: PaymentComponent },
  { path: 'confirm-order', component: ConfirmComponent },
]

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
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
