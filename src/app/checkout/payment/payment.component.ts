import { CheckoutService } from '#app/checkout/checkout.service'
import { AuthService } from '#core/auth.service'
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import * as dropin from 'braintree-web-drop-in'

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @ViewChild('dropinContainer') dropinContainer: ElementRef

  constructor(
    public checkout: CheckoutService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.checkout.loading = true
    this.checkout.order.take(1).subscribe(order => {
      if (!order.shipping) {
        // return to shipping page if we landed here first
        this.router.navigate(['/checkout/shipping-info'])
      } else {
        this.payWithMyMethod()
      }
    })
  }

  removeDropin() {
    const dropinEl = this.dropinContainer.nativeElement
    while (dropinEl.firstChild) {
      dropinEl.removeChild(dropinEl.firstChild)
    }
  }

  payWithMyMethod() {
    this.checkout.loading = true
    this.removeDropin()
    this.auth.user.take(1).subscribe(user => {
      this.checkout
        .generateToken(user.braintreeId)
        .take(1)
        .subscribe(token => {
          this.checkout.loading = false
          dropin.create(
            {
              container: '#dropin',
              authorization: token
            },
            (err, instance) => {
              if (err) {
                console.error(err)
              } else {
                this.checkout.braintreeInit(instance)
              }
            }
          )
        })
    })
  }

  payWithAgentMethod() {
    this.checkout.loading = true
    this.removeDropin()
    this.checkout.order.take(1).subscribe(order => {
      this.checkout
        .generateToken()
        .take(1)
        .subscribe(token => {
          this.checkout.loading = false
          dropin.create(
            {
              container: '#dropin',
              authorization: token
            },
            (err, instance) => {
              if (err) {
                console.error(err)
              } else {
                this.checkout.braintreeInit(instance)
              }
            }
          )
        })
    })
  }
}
