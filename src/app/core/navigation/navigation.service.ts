import { Injectable } from '@angular/core';
import { RouterModule, Routes, Router, NavigationEnd } from '@angular/router';

@Injectable()
export class NavigationService {

  isSideNavDash = false;

  constructor( private router: Router ) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
          if (event.url.startsWith('/profile')) {
              this.isSideNavDash = true;
          } else {
              this.isSideNavDash = false;
          }
      }
  });
  }
}
