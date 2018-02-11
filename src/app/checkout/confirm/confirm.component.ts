import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '#app/checkout/checkout.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(public checkout: CheckoutService) { }

  ngOnInit() {
  }

}
