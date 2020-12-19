import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Account } from '../_models/account.model';
import { finalize, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private accountSubject: BehaviorSubject<Account>;
  public account: Observable<Account>;
  reqUrl: string = environment.apiUrl + '/auth'

  constructor(private httpClient: HttpClient, private router: Router) {
    this.accountSubject = new BehaviorSubject<Account>(null);
    this.account = this.accountSubject.asObservable();
  }

  public get accountValue(): Account {
    return this.accountSubject.value;
  }

  login(userName: string, password: string) {
    return this.httpClient.post<any>(`${this.reqUrl}/authenticate`, {userName, password}, {withCredentials: true})
      .pipe(map(account => {
        this.accountSubject.next(account);
        this.startRefreshTokenTimer();
        return account;
      }));
  }

  logout() {
    this.httpClient.post<any>(`${this.reqUrl}/revoke-token`, {}, {withCredentials: true})
      .subscribe();
    this.stopRefreshTokenTimer();
    this.accountSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken() {
    return this.httpClient.post<any>(`${this.reqUrl}/refresh-token`, {}, {withCredentials: true})
      .pipe(map(account => {
        this.accountSubject.next(account);
        this.startRefreshTokenTimer();
        return account;
      }));
  }

  register(account: Account) {
    return this.httpClient.post(`${this.reqUrl}/register`, account);
  }

  verifyEmail(token: string) {
    return this.httpClient.post(`${this.reqUrl}/verify-email`, {token});
  }

  forgotPassword(email: string) {
    return this.httpClient.post(`${this.reqUrl}/forgot-password`, {email});
  }

  validateResetToken(token: string) {
    return this.httpClient.post(`${this.reqUrl}/validate-reset-token`, {token});
  }

  resetPassword(token: string, password: string, confirmPassword: string) {
    return this.httpClient.post(`${this.reqUrl}/reset-password`, {token, password, confirmPassword});
  }

  getAll() {
    return this.httpClient.get<Account[]>(this.reqUrl);
  }

  getById(id: string) {
    return this.httpClient.get<Account>(`${this.reqUrl}/${id}`);
  }

  create(params) {
    return this.httpClient.post(this.reqUrl, params)
  }

  update(id, params) {
    return this.httpClient.put(`${this.reqUrl}/${id}`, params)
      .pipe(map((account: any) => {
        // update the current account if it was updated
        if(account.id === this.accountValue.id) {
          // publish updated account to subscribers
          account = { ...this.accountValue, ...account };
          this.accountSubject.next(account);
        }
        return account;
      }));
  }

  delete(id: string) {
    return this.httpClient.delete(`${this.reqUrl}/${id}`)
      .pipe(finalize(() => {
        // auto logout if the logged in account was deleted
        if(id === this.accountValue.id) {
          this.logout();
        }
      }));
  }

  // helper methods

  private refreshTokenTimeout;

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);     //?
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout)
          //? circular ref with this.refreshToken()
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

}
