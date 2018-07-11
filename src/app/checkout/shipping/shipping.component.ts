import { CheckoutService } from '#app/checkout/checkout.service'
import { MailingListDialog } from '#app/shared/mailing-list-dialog/mailing-list.dialog'
import { AuthService } from '#core/auth.service'
import { FirestoreService } from '#core/firestore.service'
import { Order } from '#models/order.model'
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material'
import { Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs'
import { Store, Select } from "@ngxs/store";

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit, OnDestroy {
  singleAddress = true;
  isMailingList = false;

  @ViewChild('quantity') quantityInput: ElementRef;

  userSub: Subscription;
  user: any;

  lists: Observable<any[]>;
  mailingListId: string;
  mailingList: any;

  shippingForm: FormGroup;
  order: Order;

  @Select(state => state.app.user) user$;
  @Select(state => state.app.order) order$;

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    public checkout: CheckoutService,
    private firestore: FirestoreService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSub = this.auth.user.subscribe(user => {
      console.log(user);
      if (!user.currentOrder) {
        this.router.navigate(['/products'])
      }

      // load mailing lists
      this.firestore
        .colWithIds$('users', ref =>
          ref.where(`managers.${user.uid}`, '==', true)
        )
        .take(1)
        .subscribe(agents => {
          const userLists$ = this.firestore
            .colWithIds$('lists', ref =>
              ref.where('uid', '==', user.uid).orderBy('createdAt', 'desc')
            )
            .map((lists: any) => {
              lists.forEach(list => (list.agent = 'Me'))
              return lists
            })
          const listObservables = [userLists$]
          agents.forEach(agent => {
            const agentLists$ = this.firestore
              .colWithIds$('lists', ref =>
                ref.where('uid', '==', agent.uid).orderBy('createdAt', 'desc')
              )
              .map((lists: any) => {
                lists.forEach(
                  list => (list.agent = agent.firstName + ' ' + agent.lastName)
                )
                return lists
              })
            listObservables.push(agentLists$)
          })
          this.lists = this.firestore.combine(listObservables)
        })

      // load order
      if (this.checkout.initialized) {
        this.loadOrder()
      } else {
        this.checkout.initOrder().then(_ => {
          this.loadOrder()
        })
      }
    })
  }

  loadOrder() {
    this.checkout.order.take(1).subscribe((order: Order) => {
      this.order = order
      console.log(this.order.product)
      if (order.shipping) {
        this.buildForm(order.shipping)
      } else {
        console.log(order)
        this.firestore
          .doc$(`users/${order.uid}`)
          .take(1)
          .subscribe(agent => {
            this.user = agent
            this.buildForm(agent)
          })
      }
    })
  }

  ngOnDestroy() {
    this.userSub.unsubscribe()
  }

  buildForm(obj: any) {
    this.shippingForm = this.fb.group({
      firstName: [obj.firstName || '', Validators.required],
      lastName: [obj.lastName || '', Validators.required],
      address1: [obj.address1 || '', Validators.required],
      address2: [obj.address2 || ''],
      city: [obj.city || '', Validators.required],
      state: [obj.state || '', Validators.required],
      zipCode: [obj.zipCode || '', Validators.required],
      mailingListId: ['']
    })
  }

  chooseSingleAddress() {
    this.singleAddress = true;
    this.isMailingList = false;
    if (this.quantityInput.nativeElement.value) {
      this.updateQuantity(this.quantityInput.nativeElement.value);
    }
  }

  chooseMailingList() {
    this.singleAddress = false;
    this.isMailingList = true;
    if (this.mailingList) {
      this.updateQuantity(this.mailingList.rowCount);
    }
  }

  uploadList(file: File) {
    const dialogRef = this.dialog.open(MailingListDialog, {
      width: '500px',
      data: { file }
    })
    dialogRef
      .afterClosed()
      .take(1)
      .subscribe((result: any) => {
        this.shippingForm.get('mailingListId').setValue(result)
      })
  }

  setMailingList() {
    if (!this.mailingListId) {
      return
    }
    this.firestore
      .doc$(`lists/${this.mailingListId}`)
      .take(1)
      .subscribe((mailingList: any) => {
        this.mailingList = mailingList;
        this.updateQuantity(mailingList.rowCount)
      })
  }

  updateQuantity(amt) {
    const quantity = parseInt(amt)
    const pricing = this.checkout.calculatePricing(quantity)
    this.checkout.updateOrder({
      quantity,
      total: pricing.total
    })
  }

  continue() {
    if (this.isMailingList) {
      this.checkout.updateOrder({
        mailingListId: this.mailingListId,
        isMailingList: true
      })
    } else {
      this.checkout.updateOrder({
        shipping: this.shippingForm.value,
        isMailingList: false
      })
    }
    this.router.navigate(['/designer/checkout/payment-method'])
  }

  isValid() {
    if (this.isMailingList) {
      return this.mailingListId
    } else if (this.quantityInput) {
      return this.shippingForm.valid && this.quantityInput.nativeElement.value
    } else {
      return false
    }
  }
}
