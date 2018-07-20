import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/do'
import { AuthService } from './auth.service'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.auth._user
      .take(1)
      .map(user => user.admin)
      .do(isAdmin => {
        if (!isAdmin) {
          alert('Only administrators can access this page.')
          this.router.navigate(['/'])
          return false;
        } else {
          return true;
        }
      })
  }
}
