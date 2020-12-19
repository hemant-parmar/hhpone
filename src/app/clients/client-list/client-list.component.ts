import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { fromEvent, merge,  of as observableOf } from 'rxjs';
import { debounceTime, distinctUntilChanged, catchError, map, switchMap } from 'rxjs/operators';
import { Client } from 'src/app/_models/client.model';
import { ClientsDataSource } from '../clients.datasource';
import { ClientsService } from '../clients.service';
import { DeleteConfirmDialogComponent } from 'src/app/dialogs/delete-confirm-dialog.component';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'],
  // Need to remove view encapsulation so that the custom tooltip style defined in
  // `tooltip-custom-class-example.css` will not be scoped to this component's view.
  encapsulation: ViewEncapsulation.None,
})
export class ClientListComponent implements OnInit, AfterViewInit {
  dataSource: ClientsDataSource;
  data: Client[] = [];
  displayedColumns = ['compName', 'city', 'state', 'compCat', 'compSubcat', 'compClass', 'delete', 'edit'];
  isLoading = false;
  totalClients = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private clientsService: ClientsService, public dialog: MatDialog) {}

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

  onDeleteClient(id: string) {
    let dialogRef = this.dialog.open(DeleteConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result === 'yes') {
        return this.clientsService.deleteClient(
          id,
          this.input.nativeElement.value,
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize
          )
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
    });
  }

}

