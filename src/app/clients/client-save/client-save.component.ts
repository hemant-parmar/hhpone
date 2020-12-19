import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Client } from '../../_models/client.model';
import { ClientsService } from '../clients.service';
import { Person } from '../../_models/person.model';
import { DeleteConfirmDialogComponent } from 'src/app/dialogs/delete-confirm-dialog.component';
import { Director } from 'src/app/_models/director.model';

@Component({
  selector: 'app-client-save',
  templateUrl: './client-save.component.html',
  styleUrls: ['./client-save.component.css']
})
export class ClientSaveComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  client: Client;
  editMode = false;
  isLoading = false;
  private id: string;
  titleString = 'ADDING';

  recdContDataSource = false;
  clientContacts: Person[] = [];

  recdDirDataSource = false;
  clientDirectors: Director[] = [];

  contValIndex: number = 0;
  contValTitle: string = '';
  contValFName: string = '';
  contValLName: string = '';
  contValDesig: string = '';
  contValEmail: string = '';
  contValMobile1: string = '';
  contValMobile2: string = '';

  editingContact = false;
  editingDirector = false;
  openContExpPanel = false;
  openDirExpPanel = false;

  dirValIndex: number = 0;
  dirValTitle: string = '';
  dirValFName: string = '';
  dirValLName: string = '';
  dirValDesig: string = '';
  dirValEmail: string = '';
  dirValMobile1: string = '';
  dirValMobile2: string = '';
  dirValDateAppointed: Date = null;
  dirValDin: string = '';
  dirValDpin: string = '';
  dirValPan: string = '';
  dirValIsDscReg: boolean = false;
  dirValDscExpDate: Date = null;
  dirValEndDate: Date = null;
  dirValAddr1: string = '';
  dirValAddr2: string = '';
  dirValCity: string = '';
  dirValState: string = '';
  dirValPincode: string = '';

  displayedColumns: string[] = ['title', 'fName', 'lName', 'desig', 'email', 'mobile1', 'mobile2', 'delete', 'edit'];
  contDataSource: MatTableDataSource<Person>;
  dirDataSource: MatTableDataSource<Director>;

  @ViewChild('ContTablePaginator', {static: true}) contTablePaginator: MatPaginator;
  @ViewChild('ContTableSort', {static: true}) contTableSort: MatSort;

  @ViewChild('DirTablePaginator', {static: true}) dirTablePaginator: MatPaginator;
  @ViewChild('DirTableSort', {static: true}) dirTableSort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private clientsService: ClientsService,
    public dialog: MatDialog) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  ngAfterViewInit() {
    if(this.recdContDataSource) {
      this.contDataSource.paginator = this.contTablePaginator;
      this.contDataSource.sort = this.contTableSort;
    }
    if(this.recdDirDataSource) {
      this.dirDataSource.paginator = this.dirTablePaginator;
      this.dirDataSource.sort = this.dirTableSort;
    }
  }

  applyContFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.contDataSource.filter = filterValue.trim().toLowerCase();

    if (this.contDataSource.paginator) {
      this.contDataSource.paginator.firstPage();
    }
  }

  applyDirFilter(event: Event) {
    const filterValue2 = (event.target as HTMLInputElement).value;
    this.dirDataSource.filter = filterValue2.trim().toLowerCase();

    if (this.dirDataSource.paginator) {
      this.dirDataSource.paginator.firstPage();
    }
  }


  private initForm() {
    let _compName = '';
    let _addr1= '';
    let _addr2= '';
    let _city= '';
    let _state= '';
    let _pincode= '';
    let _phone1= '';
    let _phone2= '';
    let _corpOffice = {
      locationName: '',
      addr1: '',
      addr2: '',
      city: '',
      state: '',
      pincode: '',
      phone1: '',
      phone2: ''
    };
    let _compCat = '';
    let _compSubcat = '';
    let _compClass = '';
    let _dateInc = null;
    let _email = '';
    let _website = '';
    let _PAN = '';
    let _GSTN = '';
    let _CIN = '';
    let _LLPIN = '';
    let _ROC = '';
    let _regNo = '';
    let _TAN = '';

    this.form = new FormGroup({
      compName: new FormControl(_compName, Validators.required),
      addr1: new FormControl(_addr1),
      addr2: new FormControl(_addr2),
      city: new FormControl(_city),
      state: new FormControl(_state),
      pincode: new FormControl(_pincode),
      phone1: new FormControl(_phone1),
      phone2: new FormControl(_phone2),
      corpOffice: new FormGroup({
        locationName: new FormControl(_corpOffice.locationName),
        addr1: new FormControl(_corpOffice.addr1),
        addr2: new FormControl(_corpOffice.addr2),
        city: new FormControl(_corpOffice.city),
        state: new FormControl(_corpOffice.state),
        pincode: new FormControl(_corpOffice.pincode),
        phone1: new FormControl(_corpOffice.phone1),
        phone2: new FormControl(_corpOffice.phone2)
      }),
      compCat: new FormControl(_compCat),
      compSubcat: new FormControl(_compSubcat),
      compClass: new FormControl(_compClass),
      dateInc: new FormControl(_dateInc),
      email: new FormControl(_email),
      website: new FormControl(_website),
      PAN: new FormControl(_PAN),
      GSTN: new FormControl(_GSTN),
      CIN: new FormControl(_CIN),
      LLPIN: new FormControl(_LLPIN),
      ROC: new FormControl(_ROC),
      regNo: new FormControl(_regNo),
      TAN: new FormControl(_TAN),
    });


    if(this.editMode) {
      this.titleString = "EDITING"
      this.clientsService.getClient(this.id)
        .subscribe(recdClient => {
          this.client = recdClient;
          if(this.client.contacts) {
            this.contDataSource = new MatTableDataSource(this.client.contacts);
            this.clientContacts = this.client.contacts;
            this.recdContDataSource = true;
            this.contDataSource.paginator = this.contTablePaginator;
            this.contDataSource.sort = this.contTableSort;
          }
          if(this.client.directors) {
            this.dirDataSource = new MatTableDataSource(this.client.directors);
            this.clientDirectors = this.client.directors;
            this.recdDirDataSource = true;
            this.dirDataSource.paginator = this.dirTablePaginator;
            this.dirDataSource.sort = this.dirTableSort;
          }

          this.form.patchValue({
            compName: this.client.compName,
            addr1: this.client.addr1,
            addr2: this.client.addr2,
            city: this.client.city,
            state: this.client.state,
            pincode: this.client.pincode,
            phone1: this.client.phone1,
            phone2: this.client.phone2,
            corpOffice: {
              locationName: this.client.corpOffice.locationName,
              addr1: this.client.corpOffice.addr1,
              addr2: this.client.corpOffice.addr2,
              city: this.client.corpOffice.city,
              state: this.client.corpOffice.state,
              pincode: this.client.corpOffice.pincode,
              phone1: this.client.corpOffice.phone1,
              phone2: this.client.corpOffice.phone2
            },
            compCat: this.client.compCat,
            compSubcat: this.client.compSubcat,
            compClass: this.client.compClass,
            dateInc: this.client.dateInc,
            email: this.client.email,
            website: this.client.website,
            PAN: this.client.PAN,
            GSTN: this.client.GSTN,
            CIN: this.client.CIN,
            LLPIN: this.client.LLPIN,
            ROC: this.client.ROC,
            regNo: this.client.regNo,
            TAN: this.client.TAN,
          });
        });
    }else{
      this.contDataSource = new MatTableDataSource(this.clientContacts);
      this.recdContDataSource = true;
      this.contDataSource.paginator = this.contTablePaginator;
      this.contDataSource.sort = this.contTableSort;

      this.dirDataSource = new MatTableDataSource(this.clientDirectors);
      this.recdDirDataSource = true;
      this.dirDataSource.paginator = this.dirTablePaginator;
      this.dirDataSource.sort = this.dirTableSort;
    }

  }

  onClientSave() {
    const savingClient: Client = {
      compName: this.form.value.compName,
      addr1: this.form.value.addr1,
      addr2: this.form.value.addr2,
      city: this.form.value.city,
      state: this.form.value.state,
      pincode: this.form.value.pincode,
      phone1: this.form.value.phone1,
      phone2: this.form.value.phone2,
      corpOffice: {
        locationName: this.form.value.corpOffice.locationName,
        addr1: this.form.value.corpOffice.addr1,
        addr2: this.form.value.corpOffice.addr2,
        city: this.form.value.corpOffice.city,
        state: this.form.value.corpOffice.state,
        pincode: this.form.value.corpOffice.pincode,
        phone1: this.form.value.corpOffice.phone1,
        phone2: this.form.value.corpOffice.phone2
      },
      compCat: this.form.value.compCat,
      compSubcat: this.form.value.compSubcat,
      compClass: this.form.value.compClass,
      dateInc: this.form.value.dateInc,
      email: this.form.value.email,
      website: this.form.value.website,
      PAN: this.form.value.PAN,
      GSTN: this.form.value.GSTN,
      CIN: this.form.value.CIN,
      LLPIN: this.form.value.LLPIN,
      ROC: this.form.value.ROC,
      regNo: this.form.value.regNo,
      TAN: this.form.value.TAN,
      contacts: this.clientContacts,
      directors: this.clientDirectors,
    }

    if (this.editMode) {
      this.clientsService.updateClient(this.id, savingClient)
    } else {
      this.clientsService.addClient(savingClient);
    }
  }

  onEditContact(index, title, fName, lName, desig, email, mobile1, mobile2) {
    this.contValIndex = index;
    this.contValTitle = title;
    this.contValFName = fName;
    this.contValLName = lName;
    this.contValDesig = desig;
    this.contValEmail = email;
    this.contValMobile1 = mobile1;
    this.contValMobile2 = mobile2;

    this.openContExpPanel = true;
    this.editingContact = true;
  }

  onContactSave(index, title, fName, lName, desig, email, mobile1, mobile2) {
    const contact = {
      title: title,
      fName: fName,
      lName: lName,
      desig: desig,
      email: email,
      mobile1: mobile1,
      mobile2: mobile2
    }
    if(this.editingContact) {
      this.clientContacts[index] = contact;
      this.contDataSource.data = this.clientContacts;
    }else{
      this.clientContacts.push(contact);
      this.contDataSource.data = this.clientContacts;
    }
    this.onCancelContExpPanel()
  }

  onDeleteContact(index: number) {
    let dialogRef = this.dialog.open(DeleteConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result === "yes") {
        this.clientContacts.splice(index, 1);
        this.contDataSource.data = this.clientContacts;
      }
    });
  }

  onClearContExpPanel() {
    this.contValIndex = 0;
    this.contValTitle = '';
    this.contValFName = '';
    this.contValLName = '';
    this.contValDesig = '';
    this.contValEmail = '';
    this.contValMobile1 = '';
    this.contValMobile2 = '';

    this.editingContact = false;
  }

  onCancelContExpPanel() {
    this.onClearContExpPanel();
    this.openContExpPanel = false;
  }

  // DIRECTORS FUNCTIONS
  onEditDirector(index, title, fName, lName, desig, email, mobile1, mobile2, dateAppointed, din, dpin, pan, isDscReg, dscExpiryDate, endDate, addr1, addr2, city, state, pincode) {
    this.dirValIndex = index;
    this.dirValTitle = title || '';
    this.dirValFName = fName || '';
    this.dirValLName = lName || '';
    this.dirValDesig = desig || '';
    this.dirValEmail = email || '';
    this.dirValMobile1 = mobile1 || '';
    this.dirValMobile2 = mobile2 || '';
    this.dirValDateAppointed = dateAppointed;
    this.dirValDin = din || '';
    this.dirValDpin = dpin || '';
    this.dirValPan = pan || '';
    this.dirValIsDscReg = isDscReg;
    this.dirValDscExpDate = dscExpiryDate;
    this.dirValEndDate = endDate;
    this.dirValAddr1 = addr1 || '';
    this.dirValAddr2 = addr2 || '';
    this.dirValCity = city || '';
    this.dirValState = state || '';
    this.dirValPincode = pincode || '';

    this.openDirExpPanel = true;
    this.editingDirector = true;
  }

  onDirectorSave(index, title, fName, lName, desig, email, mobile1, mobile2, dateAppointed, din, dpin, pan, isDscReg, dscExpiryDate, endDate, addr1, addr2, city, state, pincode ) {
    const director = {
      title: title,
      fName: fName,
      lName: lName,
      desig: desig,
      email: email,
      mobile1: mobile1,
      mobile2: mobile2,
      dateAppointed: dateAppointed,
      din: din,
      dpin: dpin,
      pan: pan,
      isDscReg: isDscReg,
      dscExpiryDate: dscExpiryDate,
      endDate: endDate,
      addr1: addr1,
      addr2: addr2,
      city: city,
      state: state,
      pincode: pincode,
    }
    console.log(director)
    if(this.editingDirector) {
      this.clientDirectors[index] = director;
      this.dirDataSource.data = this.clientDirectors;
    }else{
      this.clientDirectors.push(director);
      this.dirDataSource.data = this.clientDirectors;
    }
    console.log(this.clientDirectors);
    this.onCancelDirExpPanel()
  }

  onDeleteDirector(index: number) {
    let dialogRef = this.dialog.open(DeleteConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result === "yes") {
        this.clientContacts.splice(index, 1);
        this.contDataSource.data = this.clientContacts;
      }
    });
  }

  onClearDirExpPanel() {
    this.dirValIndex = 0;
    this.dirValTitle = '';
    this.dirValFName = '';
    this.dirValLName = '';
    this.dirValDesig = '';
    this.dirValEmail = '';
    this.dirValMobile1 = '';
    this.dirValMobile2 = '';
    this.dirValDateAppointed = null;
    this.dirValDin = '';
    this.dirValDpin = '';
    this.dirValPan = '';
    this.dirValIsDscReg = false;
    this.dirValDscExpDate = null;
    this.dirValEndDate = null;
    this.dirValAddr1 = '';
    this.dirValAddr2 = '';
    this.dirValCity = '';
    this.dirValState = '';
    this.dirValPincode = '';

    this.editingDirector = false;
  }

  onCancelDirExpPanel() {
    this.onClearDirExpPanel();
    this.openDirExpPanel = false;
    this.editingDirector = false;
  }

}
