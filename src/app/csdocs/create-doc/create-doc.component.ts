import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';

import { ClientsService } from 'src/app/clients/clients.service';
import { DocListService } from 'src/app/csdocs/doc-list.service';
import { Client } from 'src/app/_models/client.model';
import { ClientsDataSource } from '../../clients/clients.datasource';
import { MatTableDataSource } from '@angular/material/table';
import { Doc } from 'src/app/_models/doc.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-doc',
  templateUrl:'./create-doc.component.html',
  styleUrls:['./create-doc.component.css']
})
export class CreateDocComponent implements OnInit, AfterViewInit {
  reqUrl: string = environment.apiUrl
  dataSource: ClientsDataSource;
  docListDataSource: MatTableDataSource<Doc>;
  data: Client[] = [];
  displayedColumns = ['compName', 'city', 'select'];
  docDisplayedColumns = ['docName', 'select'];
  isLoading = false;
  totalClients = 0;
  totalDocs = 0;

  selectedClient = "";
  selectedClientId = "";
  selectedDoc = "";
  selectedDocId = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  @ViewChild('docListPaginator', {static: true}) docListPaginator: MatPaginator;
  @ViewChild('docListSort', {static: true}) docListSort: MatSort;

  form: FormGroup;
  docList: Doc[] = [];
  filteredOptions: Observable<string[]>;
  clientNames: string[] = [];
  filteredClients: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private router: Router,
    private clientsService: ClientsService,
    private docListService: DocListService) {
      this.docList = this.docListService.getDocList();
      this.docListDataSource = new MatTableDataSource(this.docList)
      this.totalDocs = this.docList.length
    }

  ngOnInit() {
    this.isLoading = true
    this.clientsService.getClients('', '', 'asc', 0, 5)
      .pipe(
        map(clientData => {
          this.isLoading = false;
          this.totalClients = clientData.totalCount;
          return clientData.clients;
        }),
        catchError(() => {
          this.isLoading = false;
          return observableOf([])
        })
      )
      .subscribe(recdClients => this.data = recdClients);
    }

  ngAfterViewInit() {
    this.docListDataSource.paginator = this.docListPaginator;
    this.docListDataSource.sort = this.docListSort;

    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => {
          this.isLoading = true;
          return this.clientsService.getClients(
            this.input.nativeElement.value,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize
          );
        }),
        map(clientData => {
          this.isLoading = false;
          this.totalClients = clientData.totalCount;
          return clientData.clients;
        }),
        catchError(() => {
          this.isLoading = false;
          return observableOf([])
        })
      )
      .subscribe(recdClients => this.data = recdClients);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // on sort or paginate events, load a new page
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        switchMap(() => {
          console.log('reached merge switchMap');
          this.isLoading = true;
          return this.clientsService.getClients(
            this.input.nativeElement.value,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize
          );
        }),
        map(clientData => {
          this.isLoading = false;
          this.totalClients = clientData.totalCount;
          return clientData.clients;
        }),
        catchError(() => {
          this.isLoading = false;
          return observableOf([])
        })
      )
      .subscribe(recdClients => this.data = recdClients);
  }

  applyDocFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.docListDataSource.filter = filterValue.trim().toLowerCase();

    if (this.docListDataSource.paginator) {
      this.docListDataSource.paginator.firstPage();
    }
  }

  onSelectClient(id: string, compName: string) {
    this.selectedClient = compName;
    this.selectedClientId = id;
  }

  onSelectDoc(id: string, docName: string) {
    this.selectedDoc = docName;
    this.selectedDocId = id;
  }

  onStart() {
    // this.httpClient.get(this.reqUrl + "/" + this.selectedDocId);
    this.router.navigate([ "/" + this.selectedDocId + "/" + this.selectedClientId])
  }

}
    // this.options = this.docListService.getDocList();
    // this.form = this.fb.group({
    //   selectDoc: [''],
    //   selectClient: ['']
    // });
    // this.filteredOptions = this.form.get('selectDoc').valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value))
    //   );

    //   this.clientsService.getClientNames()
    //   .subscribe(documents => {
    //     documents.forEach(e => {
    //       this.clientNames.push(e.compName)
    //     });
    //     this.filteredClients = this.form.get('selectClient').valueChanges
    //       .pipe(
    //         startWith(''),
    //         map(value => this._filterClient(value))
    //       );
    //     });


  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option =>
  //     option.toLowerCase().includes(filterValue));
  // }

  // private _filterClient(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.clientNames.filter(option =>
  //     option.toLowerCase().includes(filterValue));
  // }

  // onStart() {
  //   alert(this.form.value.selectClient);
  //   // this.clientNames.includes("")
  //   // if(this.clientNames.includes(this.form.get('selectClient').value) = false) {

  //   // }
  // }

