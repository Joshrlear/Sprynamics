import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '#core/firestore.service';
import { Observable } from 'rxjs/Observable';
import { Order } from '#app/checkout/order.interface';
import { AuthService } from '#core/auth.service';

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
      this.orders = this.firestore.colWithIds$('orders', ref => ref.where('uid', '==', user.uid));
      this.orders.take(1).subscribe(orders => {
        console.log(orders[0].createdAt);
      })
    });
  }

}