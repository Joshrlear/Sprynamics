import { CheckoutService } from '#app/checkout/checkout.service'
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-confirm',
  template: `
    <div style="height:350;display:flex;align-items:center;justify-content:center;">
      <mat-spinner *ngIf="checkout.loading"></mat-spinner>
    </div>
    <ng-container *ngIf="!checkout.loading">
      <h2>Thank you for your order!</h2>
      <h5>Your order ID is: {{ (checkout.order | async)?.id }}</h5>
      <app-order-receipt [order]="checkout.order"></app-order-receipt>
    </ng-container>
  `
})
export class ConfirmComponent implements OnInit {
  constructor(public checkout: CheckoutService) {}

  ngOnInit() {
    this.checkout.order.subscribe(order => {
      console.log(order)
    })
  }
}
