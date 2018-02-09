import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {

  singleAddress = true;
  mailingList = false;

  constructor() { }

  ngOnInit() {
  }

  chooseSingleAddress() {
    this.singleAddress = true;
    this.mailingList = false;
  }

  chooseMailingList() {
    this.singleAddress = false;
    this.mailingList = true;
  }

}
