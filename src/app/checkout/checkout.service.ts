import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Order } from '#app/checkout/order.interface';
import { AuthService } from '#core/auth.service';
import { FirestoreService } from '#core/firestore.service';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class CheckoutService {

  private _order = new BehaviorSubject<Order>({});
  public order = this._order.asObservable();

  private _braintreeUI = new BehaviorSubject<any>(null);
  public braintreeUI = this._braintreeUI.asObservable();

  loading: boolean;
  initialized: boolean;

  constructor(private http: Http,
    private auth: AuthService,
    private firestore: FirestoreService,
    private router: Router,
    private afs: AngularFirestore) {
  }

  initOrder() {
    return new Promise((resolve, reject) => {
      this.auth.user.take(1).subscribe(user => {
        if (user.currentOrder) {
          this.firestore.doc$(`orders/${user.currentOrder}`).take(1).subscribe(order => {
            this._order.next(order);
            this.initialized = true;
            resolve();
          });
        } else {
          // create an order ID
          const orderId = this.afs.collection('orders').ref.doc().id;
          this.firestore.set(`orders/${orderId}`, { id: orderId, uid: user.uid, submitted: false }).then(_ => {
            this.firestore.update(`users/${user.uid}`, { currentOrder: orderId }).then(_ => {
              this.updateOrder('orderId', orderId);
              this.updateOrder('submitted', false);
              this.updateOrder('name', user.firstName + (user.lastName? ' ' + user.lastName : ''))
              this.setUser(user).then(_ => {
                this.initialized = true;
                resolve();
              });
            });
          })
        }
      });
    });
  }

  setUser(user) {
    return new Promise((resolve, reject) => {
      this.updateOrder('uid', user.uid);
      if (user.braintreeId) {
        this.updateOrder('customerId', user.braintreeId);
        resolve(this._order.value);
      } else {
        // init braintree customer for this user
        const data = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
        this.http.post('https://us-central1-sprynamics.cloudfunctions.net/customer', data)
          .take(1).subscribe((res: any) => {
            console.log(res);
            const id = JSON.parse(res._body).customerId;
            this.updateOrder('customerId', id);
            this.firestore.update(`users/${user.uid}`, { braintreeId: id }).then(_ => {
              resolve(this._order.value);
            })
          });
      }
    })
  }

  updateOrder(key, value) {
    const data = this._order.getValue();
    data[key] = value;
    this._order.next(data);
  }

  /**
   * Generates a token for braintree payment
   * @param uid Optional user ID, if not given this will use the agent set in the order
   */
  generateToken(uid?: string) {
    const token$ = this.http.post('https://us-central1-sprynamics.cloudfunctions.net/getClientToken',
      { customerId: uid || this._order.getValue().customerId })
      .map((res: any) => JSON.parse(res._body).token);
    this.updateOrder('token$', token$);
    return token$;
  }

  braintreeInit(instance) {
    this._braintreeUI.next(instance);
  }

  submitOrder() {
    if (!this._order.getValue().submitted) {
      this.updateOrder('submitted', true);
      this.router.navigate(['/checkout/confirm-order']);
      // this.firestore.update(`orders/${this._order.getValue().orderId}`, this._order.getValue());
      this.http.post('https://us-central1-sprynamics.cloudfunctions.net/checkout', this._order.getValue())
        .take(1).subscribe((res: any) => {
          // window.alert((JSON.parse(res._body)).message);
          this.loading = false;
          // remove the current order from the user, since it's been submitted
          this.auth.user.take(1).subscribe(user => {
            this.firestore.update(`users/${user.uid}`, { currentOrder: null });
          });
        });
    }
  }

  calculatePricing(amt: number) {
    const pricing: any = {};
    if (!amt) {
      pricing.subtotal = 0;
      pricing.shipping = 0;
      pricing.total = 0;
      return pricing;
    }
    amt *= 0.99;
    amt += 20; // design cost
    pricing.subtotal = amt;
    if (amt <= 15) pricing.shipping = 4.99;
    else if (amt <= 20) pricing.shipping = 5.99;
    else if (amt <= 30) pricing.shipping = 6.49;
    else if (amt <= 50) pricing.shipping = 6.99;
    else if (amt <= 70) pricing.shipping = 7.99;
    else if (amt <= 90) pricing.shipping = 8.49;
    else if (amt <= 150) pricing.shipping = 12.99;
    else if (amt <= 200) pricing.shipping = 15.49;
    else if (amt <= 300) pricing.shipping = 16.99;
    else if (amt <= 500) pricing.shipping = 23.99;
    else pricing.shipping = 23.99;
    pricing.total = amt + pricing.shipping;

    return pricing;
  }
}