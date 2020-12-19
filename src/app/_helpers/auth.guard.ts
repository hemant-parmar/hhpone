import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AccountService } from '../account/account.service';

@Injectable({providedIn : 'root'})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const account = this.accountService.accountValue;

    if(account) {
      // check if route is restricted by role
      if(route.data.roles && !route.data.roles.includes(account.role)) {
        // role not authorized so redirect to home page
        this.router.navigate(['/']);
        return false;
      }

      // authorized so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
