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

  toggleMenu() {
    document.getElementById("mobile-menu_dropdown").classList.toggle("active");
  }
  
  public logout() {
    this.auth.logout();
  }

}
