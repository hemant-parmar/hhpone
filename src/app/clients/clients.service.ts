import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Client } from '../_models/client.model';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class ClientsService {
  private clients: Client[] = [];
  reqUrl: string = environment.apiUrl + '/clients';

  constructor(private httpClient: HttpClient, private router: Router) {}

  addClient(client: Client) {
    this.httpClient.post<{message: string, clientId: string}>(this.reqUrl, client)
      .subscribe(res => {
        this.router.navigate(['/']);
      });
  }

  getClients(filter: string, sortKey: string, sortOrder: string, pageIndex: number, pageSize: number): Observable<{clients: Client[], totalCount: number}> {
    if (sortKey === '') { sortKey = 'compName'}
    return this.httpClient.get<{clients: Client[], totalCount: number}>(this.reqUrl, {
      params: new HttpParams ()
        .set('filter', filter)
        .set('sortKey', sortKey)
        .set('sortOrder', sortOrder)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    });
    // .pipe(map( clientData => res['payload']));
  }

  getClientNames() {
    return this.httpClient.get<any>(this.reqUrl + '/clientNames');
  }

  getClient(id: string) {
    return this.httpClient.get<Client>(this.reqUrl + '/' + id);
  }

  updateClient(id: string, client: Client) {
    this.httpClient.put(this.reqUrl + '/' + id, client)
      .subscribe(res => {
        alert('Client Updated');
        // this.router.navigate(['/']);
      });
  }

  deleteClient(id: string, filter: string, sortKey: string, sortOrder: string, pageIndex: number, pageSize: number): Observable<{clients: Client[], totalCount: number}> {
    return this.httpClient.delete<{clients: Client[], totalCount: number}>
    (this.reqUrl + '/' + id, {
      params: new HttpParams ()
        .set('filter', filter)
        .set('sortKey', sortKey)
        .set('sortOrder', sortOrder)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    });
  }

}
