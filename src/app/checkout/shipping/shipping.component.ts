import { Component, OnInit } from '@angular/core';
import { AuthService } from '#core/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {

  singleAddress = true;
  mailingList = false;

  userSub: Subscription;
  user: any;

  shippingForm: FormGroup;

  constructor(public auth: AuthService, private fb: FormBuilder) { }

  ngOnInit() {
    this.userSub = this.auth.user.subscribe(user => {
      this.user = user;

      this.shippingForm = this.fb.group({
        'firstName': [user.firstName || '', Validators.required],
        'lastName': [user.lastName || '', Validators.required],
        'address1': [user.address1 || '', Validators.required],
        'address2': [user.address2 || ''],
        'city': [user.city || '', Validators.required],
        'state': [user.state || '', Validators.required],
        'zipCode': [user.zipCode || '', Validators.required]
      });
    });
  }

  chooseSingleAddress() {
    this.singleAddress = true;
    this.mailingList = false;
  }

  chooseMailingList() {
    this.singleAddress = false;
    this.mailingList = true;
  }

  submitForm() {

  }

}
