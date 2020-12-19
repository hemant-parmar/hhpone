import { BehaviorSubject, of} from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Client } from '../_models/client.model';
import { ClientsService } from './clients.service';

export interface ClientsData {
  clients: Client[],
  totalClients: number
}

export class ClientsDataSource {
  // private clientsSubject = new BehaviorSubject<Client[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false)
  public loading$ = this.loadingSubject.asObservable();

  constructor(private clientsService: ClientsService) {}

  loadClients(filter: string, sortKey: string, sortOrder: string, pageIndex: number, pageSize: number) {
    this.loadingSubject.next(true);
    this.clientsService.getClients(filter, sortKey, sortOrder, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(clientsData => {
        console.log('recd clientsdata - ' + clientsData);
        // this.clientsSubject.next(clientsData)
      });
  }

  // connect(collectionViewer: CollectionViewer): Observable<Client[]> {
  //   return this.clientsSubject.asObservable();
  // }

  // disconnect(collectionViewer: CollectionViewer): void {
  //   this.clientsSubject.complete();
  //   this.loadingSubject.complete();
  // }

}
