import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if account is logged in and request is to the api url
    const account = this.accountService.accountValue;
    const isLoggedin = account && account.jwtToken;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if(isLoggedin && isApiUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${account.jwtToken}` }
      });
    }

    return next.handle(request);
  }
}
