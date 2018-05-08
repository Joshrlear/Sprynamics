import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from './auth.service';

import { Observable } from 'rxjs';

import 'rxjs/add/operator/do';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.auth.user
      .take(1)
      .map(user => user.admin)
      .do(isAdmin => {
        if (!isAdmin) {
          alert('Only administrators can access this page.');
          this.router.navigate(['/']);
        }
      });
  }

}
