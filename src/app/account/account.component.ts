import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  template: `
    <div class="account-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
