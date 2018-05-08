import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '#core/firestore.service';
import { Observable } from 'rxjs';
import { Order } from '#app/checkout/order.interface';
import { AuthService } from '#core/auth.service';

import * as moment from 'moment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders: Observable<Order[]>

  constructor(private auth: AuthService, private firestore: FirestoreService) { }

  ngOnInit() {
    this.auth.user.take(1).subscribe(user => {
      // get all orders for the logged-in user
      this.orders = this.firestore.colWithIds$('orders', ref => ref.where('uid', '==', user.uid).orderBy('createdAt', 'desc'));
      this.orders.take(1).subscribe(orders => {
        console.log(orders[0].createdAt);
      })
    });
  }

  formatDate(dateString: string) {
    return moment(dateString).format('MMM Do YYYY, [at] h:mm:ss a') + ` (${moment(dateString).fromNow()})`;
  }

}
