import { Component, OnInit, Input, Inject } from '@angular/core';

import * as dropin from 'braintree-web-drop-in';
import { Observable } from 'rxjs/Observable';
import { CheckoutService } from '#app/checkout/checkout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor(public checkout: CheckoutService, private router: Router) { }

  ngOnInit() {
    this.checkout.loading = true;
    this.checkout.order.take(1).subscribe(order => {
      if (!order.shipping) {
        // return to shipping page if we landed here first
        this.router.navigate(['/checkout/shipping-info']);
      } else {
        this.checkout.generateToken().take(1).subscribe(token => {
          this.checkout.loading = false;
          dropin.create({
            container: '#dropin',
            authorization: token
          }, (err, instance) => {
            this.checkout.braintreeInit(instance);
          });
        });
      }
    })
  }
}
