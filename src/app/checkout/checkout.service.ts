import { Injectable } from "@angular/core"
import { Http } from "@angular/http"
import { Observable, BehaviorSubject } from "rxjs"
// import { Order } from "#models/order.model"
import { Order } from '#models/state.model';
import { AuthService } from "#core/auth.service"
import { FirestoreService } from "#core/firestore.service"
import { Router } from "@angular/router"
import { AngularFirestore } from "angularfire2/firestore"
import { StorageService } from "#core/storage.service"
import { SetUser, UpdateUser, CreateOrder, UpdateOrder, SubmitOrder } from "#app/checkout/app.actions";
import { Store, Select } from "@ngxs/store";
import { StateService } from '#app/core/state.service';

@Injectable()
export class CheckoutService {
  // private _order = new BehaviorSubject<Order>({})
  // public order = this._order.asObservable()

  @Select(state => state.app.order) order;
  @Select(state => state.app.user) user$;
  private _order: any;

  private _braintreeUI = new BehaviorSubject<any>(null)
  public braintreeUI = this._braintreeUI.asObservable()

  loading: boolean
  initialized: boolean

  thumbnail: string

  pricing: any

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private firestore: FirestoreService,
    private http: Http,
    private router: Router,
    private storage: StorageService,
    private store: Store,
    private state: StateService
  ) {
    this.order.subscribe((order) => {
      this._order = order;
    });
  }

  initOrder() {
    return new Promise((resolve, reject) => {
      this.auth.user.take(1).subscribe(user => {
        if (!user) {
          resolve()
        } else {
          this.store.dispatch(new SetUser(user));
          this._initialize(user).then(_ => resolve())
        }
      })
    })
  }

  private _initialize(user) {
    return new Promise(async (resolve, reject) => {
      // load pricing information
      this.firestore
        .doc$('_var/pricing')
        .take(1)
        .subscribe((pricing: any) => {
          this.pricing = pricing
        })

      if (user.currentOrder) {
        if (await this.firestore.exists(`orders/${user.currentOrder}`)) {
          this.firestore
          .doc$(`orders/${user.currentOrder}`)
          .take(1)
          .subscribe(order => {
            this.store.dispatch(new UpdateOrder(order));
            // this._order.next(order);
            this.initialized = true;
            resolve()
          })
        } else {
          // remove the order from the user doc if it doesn't exist anymore
          this.store.dispatch(new UpdateUser({ currentOrder: null }));
          this.firestore.update(`users/${user.uid}`, { currentOrder: null })
        }
      } else {
        // create an order ID
        const orderId = this.afs.collection("orders").ref.doc().id
        let order = {
          id: orderId,
          userId: user.uid,
          step: 'designer'
        };
        this.store.dispatch(new CreateOrder(order));
        this.firestore.set(`orders/${orderId}`, order).then(_ => {
          this.firestore.upsert(`users/${user.uid}`, { currentOrder: orderId }).then(_ => {
            let payload = {
              id: orderId,
              step: 'designer',
              shipping: {
                firstName: user.firstName || "",
                lastName: user.lastName || ""
              }
            };
            this.updateOrder(payload)
            this.setUser(user).then(_ => {
              this.initialized = true
              resolve()
            })
          })
        })
      }
    })
  }

  setUser(user) {
    this.store.dispatch(new SetUser(user));
    return new Promise((resolve, reject) => {
      this.updateOrder({ userId: user.uid })
      if (user.braintreeId) {
        this.updateOrder({ customerId: user.braintreeId })
        resolve(this._order)
      } else {
        // init braintree customer for this user
        const data = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
        this.http
          .post('https://us-central1-sprynamics.cloudfunctions.net/customer', data)
          .take(1)
          .subscribe((res: any) => {
            console.log(res)
            const id = JSON.parse(res._body).customerId
            this.updateOrder({ customerId: id })
            this.store.dispatch(new UpdateUser({ braintreeId: id }));
            this.firestore.update(`users/${user.uid}`, { braintreeId: id }).then(_ => {
              resolve(this._order)
            })
          })
      }
    })
  }

  updateOrder(partialOrder: any): Promise<void> {
    const data = this._order;
    Object.assign(data, partialOrder)
    // this._order.next(data)
    this.state.setOrderState(data);
    this.store.dispatch(new UpdateOrder(partialOrder));
    return this.firestore.update(`orders/${this._order.id}`, partialOrder)
  }

  /**
   * Generates a token for braintree payment
   * @param uid Optional user ID, if not given this will use the agent set in the order
   */
  generateToken(uid?: string) {
    const token$ = this.http
      .post('https://us-central1-sprynamics.cloudfunctions.net/client_token', { customerId: uid || this._order.customerId })
      .map((res: any) => JSON.parse(res._body).token)
    token$.take(1).subscribe(token => {
      this.updateOrder({ token })
    })
    console.log("Generated token", token$)
    return token$
  }

  braintreeInit(instance) {
    this._braintreeUI.next(instance)
  }

  submitOrder() {
    if (this._order.step === 'designer') {
      this.router.navigate(["/designer/checkout/confirm-order"])
      // this.firestore.update(`orders/${this._order.getValue().orderId}`, this._order.getValue());
      this.http
        .post("https://us-central1-sprynamics.cloudfunctions.net/checkout", this._order)
        .take(1)
        .subscribe((res: any) => {
          this.updateOrder({ step : 'checkout' })
          console.log(res)
          // window.alert((JSON.parse(res._body)).message);
          this.loading = false
          // remove the current order from the user, since it's been submitted
          this.auth.user.take(1).subscribe(user => {
            this.store.dispatch(new UpdateUser({ currentOrder: null }));
            this.firestore.update(`users/${user.uid}`, { currentOrder: null })
            this.store.dispatch(new SubmitOrder());
          })
        })
    }
  }

  calculatePricing(amt: number) {
    const product = this._order.product || 'postcard';
    // round up to the nearest 50
    const roundedQuantity = Math.ceil(amt / 50) * 50;
    const quantityPosition = roundedQuantity / 50;
    const priceForQuantity = parseFloat(this.pricing[product][quantityPosition]);

    const pricing: any = {};
    if (!amt) {
      pricing.total = 0;
      return pricing;
    }
    pricing.total = priceForQuantity;

    return pricing;
  }
}
