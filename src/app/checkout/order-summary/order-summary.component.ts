import { CheckoutService } from '#app/checkout/checkout.service'
import { AuthService } from '#core/auth.service'
import { User } from '#models/user.model'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs'

@Component({
  selector: 'order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  get nextRoute() {
    switch (this.router.url) {
      case '/designer/checkout/shipping-info':
        return '/designer/checkout/payment-method'
      case '/designer/checkout/payment-method':
        return '/designer/checkout/confirm-order'
    }
  }

  subtotal = 0
  shipping = 0
  total = 0

  orderSub: Subscription
  braintreeSub: Subscription

  instance: any

  user: Observable<User>

  constructor(
    public router: Router,
    public checkout: CheckoutService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.user = this.auth.user

    this.orderSub = this.checkout.order.subscribe(order => {
      this.subtotal = order.subtotal
      this.shipping = order.shippingCost
      this.total = order.total
    })

    this.braintreeSub = this.checkout.braintreeUI.subscribe(instance => {
      this.instance = instance
    })
  }

  ngOnDestroy() {
    this.orderSub.unsubscribe()
    this.braintreeSub.unsubscribe()
  }

  clickCheckout() {
    if (this.router.url.endsWith('shipping-info')) {
      this.router.navigate(['/designer/checkout/payment-method'])
    } else if (this.router.url.endsWith('payment-method')) {
      this.checkout.loading = true
      if (this.instance) {
        this.instance.requestPaymentMethod((err, payload) => {
          if (err) {
            window.alert(err.message)
          } else {
            this.checkout.updateOrder({ nonce: payload.nonce })
            this.checkout.submitOrder()
          }
        })
      }
    }
  }
}
