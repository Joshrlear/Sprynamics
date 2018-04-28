import { Component, OnInit, Input } from '@angular/core';
import { Order } from '#app/checkout/order.interface';

@Component({
  selector: 'app-order-receipt',
  templateUrl: './order-receipt.component.html',
  styleUrls: ['./order-receipt.component.scss']
})
export class OrderReceiptComponent implements OnInit {

  @Input('order') order: Order;

  constructor() { }

  ngOnInit() {
  }

}
