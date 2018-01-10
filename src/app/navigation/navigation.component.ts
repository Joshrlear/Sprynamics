import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  goHome() {
     
  }
  
  public logout() {
    this.auth.logout();
  }

}
