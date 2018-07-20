import { AuthService } from '#core/auth.service'
import { FirestoreService } from '#core/firestore.service'
import { Order } from '#models/order.model'
import {Component, Input, OnInit} from '@angular/core'
import * as moment from 'moment'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Observable<Order[]>;

  @Input('agent') agent: any

  constructor(private auth: AuthService, private firestore: FirestoreService) {}

  ngOnInit() {
    if (this.agent) {
      this.getAllOrders(this.agent);
    } else {
      this.auth.user.take(1).subscribe(user => {
        // get all orders for the logged-in user
        this.getAllOrders(user);
      });
    }
  }

  formatDate(dateString: string) {
    return (
      moment(dateString).format('MMM Do YYYY, [at] h:mm:ss a') +
      ` (${moment(dateString).fromNow()})`
    )
  }

  getAllOrders(user: any) {
    this.orders = this.firestore.colWithIds$('orders', ref =>
      ref.where('uid', '==', user.uid).orderBy('createdAt', 'desc')
    );
    this.orders.take(1).subscribe(orders => {
      if (orders.length > 0) {
        console.log(orders[0].createdAt)
      }
    });
  }
}
