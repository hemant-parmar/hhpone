import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Employee } from '../_models/employee.model';

@Injectable({ providedIn: 'root'})
export class EmployeesService {
  reqUrl = environment.apiUrl + '/employees';

  constructor(private httpClient: HttpClient, private router: Router) {}

  addEmployee(employee: Employee) {
    console.log('In EmpService addEmployee method');
    this.httpClient.post(this.reqUrl, employee)
      .subscribe(() => {
        this.router.navigate(['/employees']);
      });
  }

  getEmployees(filter: string, sortKey: string, sortOrder: string, pageIndex: number, pageSize: number): Observable<{employees: Employee[], totalCount: number}> {
    if (sortKey === '') { sortKey = 'fName'}
    return this.httpClient.get<{employees: Employee[], totalCount: number}>(this.reqUrl, {
      params: new HttpParams ()
        .set('filter', filter)
        .set('sortKey', sortKey)
        .set('sortOrder', sortOrder)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    });
  }

  getNonUserEmployees(){
    return this.httpClient.get<any>(this.reqUrl+'/nonuser');
  }

  getEmployee(id: string) {
    return this.httpClient.get<Employee>(this.reqUrl + '/' + id);
  }

  updateEmployee(id: string, employee: Employee) {
    this.httpClient.put(this.reqUrl + '/' +id, employee)
      .subscribe(() => {
        alert('Emplyee data updated.');
      });
  }

  deleteEmployee(id: string, filter: string, sortKey: string, sortOrder: string, pageIndex: number, pageSize: number): Observable<{employees: Employee[], totalCount: number}> {
    return this.httpClient.delete<{employees: Employee[], totalCount: number}>
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
