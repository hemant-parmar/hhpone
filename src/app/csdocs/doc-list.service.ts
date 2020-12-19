import { Injectable } from '@angular/core';
import { Doc } from '../_models/doc.model';

@Injectable({ providedIn: 'root'})
export class DocListService {
  docList: Doc[] = [
    {docId:'bmNotice', docName:'Board Meeting Notice'},
    {docId:'agmNotice', docName:'AGM Notice'},
    {docId:'bmMinutes', docName:'Board Meeting Minutes'}
  ]

  getDocList() {
    return this.docList;
  }

  
}
