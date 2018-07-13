import { Injectable } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'

@Injectable()
export class NavigationService {
  isSideNavDash = false

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.startsWith('/profile') || event.url.startsWith('/admin')) {
          this.isSideNavDash = true
        } else {
          this.isSideNavDash = false
        }
      }
    })
  }
}
