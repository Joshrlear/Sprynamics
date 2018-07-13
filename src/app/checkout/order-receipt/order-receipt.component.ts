import { Order } from '#models/order.model'
import { Component, Input, OnInit } from '@angular/core'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-order-receipt',
  templateUrl: './order-receipt.component.html',
  styleUrls: ['./order-receipt.component.scss']
})
export class OrderReceiptComponent implements OnInit {
  @Input('order') order: Observable<Order>

  constructor() {}

  ngOnInit() {}
}
