import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { CheckoutService } from '#app/checkout/checkout.service';
import { Order } from '#app/checkout/order.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  order: Observable<Order>;

  constructor(public checkout: CheckoutService, public router: Router) { }

  ngOnInit() {
    console.log('init');
    this.order = this.checkout.order;
    // this.checkout.initOrder();
  }

}
