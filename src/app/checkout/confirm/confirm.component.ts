import { CheckoutService } from '#app/checkout/checkout.service'
import { Component, OnInit } from '@angular/core'
import { Order } from '#models/state.model';

@Component({
  selector: 'app-confirm',
  template: `
    <div style="height:350;display:flex;align-items:center;justify-content:center;">
      <mat-spinner *ngIf="checkout.loading"></mat-spinner>
    </div>
    <ng-container *ngIf="!checkout.loading">
      <h2>Thank you for your order!</h2>
      <h5>Your order ID is: {{ (order)?.id }}</h5>
      <app-order-receipt [order]="order"></app-order-receipt>
    </ng-container>
  `
})
export class ConfirmComponent implements OnInit {
  order: Order;

  constructor(public checkout: CheckoutService) {}

  ngOnInit() {
    this.checkout.order.subscribe(order => {
      console.log(order)
      if (order) {
        this.order = Object.assign({}, order);
      }
    })
  }
}
