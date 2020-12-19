import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {SelectionModel} from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';

import { ClientsService } from 'src/app/clients/clients.service';
import { Client } from 'src/app/_models/client.model';
import { Director } from 'src/app/_models/director.model';
import { Person } from 'src/app/_models/person.model';
import { PdfService } from '../pdf.service';
import { BmNotice } from 'src/app/_models/bmNotice.model';


@Component({
  selector: 'app-board-meeting-notice',
  templateUrl: './board-meeting-notice.component.html',
  styleUrls: ['./board-meeting-notice.component.css']
})
export class BoardMeetingNoticeComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  client: Client;
  bmNotice: BmNotice;
  recdDirDataSource = false;
  clientDirectors: Director[] = [];
  recdContDataSource = false;
  clientContacts: Person[] = [];
  private id: string;

  i = 0;

  selectedClient = "";
  selectedBmAddr = "";
  shortNotice = "";
  selectedContacts = []
  bmAddrOptions: string[] = [];


  displayedColumns: string[] = [ 'select', 'fName', 'lName', 'desig', 'email', 'mobile1'];
  // contDisplayedColumns: string[] = ['title', 'fName', 'lName', 'desig', 'email', 'mobile1', 'select'];
  dirDataSource: MatTableDataSource<Director>;
  contDataSource: MatTableDataSource<Person>;
  selection: SelectionModel<Person>;

  @ViewChild('ContTablePaginator', {static: true}) contTablePaginator: MatPaginator;
  @ViewChild('ContTableSort', {static: true}) contTableSort: MatSort;

  @ViewChild('DirTablePaginator', {static: true}) dirTablePaginator: MatPaginator;
  @ViewChild('DirTableSort', {static: true}) dirTableSort: MatSort;

  compLawOptions: string[] = [
    "To ratify the shorter notice for calling the Board Meeting",
  ];

  financeOptions: string[] = [
    "To ratify the shorter notice for calling the Board Meeting",
    "To consider the appointment of Chairman",
    "To consider leave of absence, if any",
    "To take note the minutes of the previous Board Meeting"
  ];

  regulatoryOptions: string[] = [
    "To ratify the shorter notice for calling the Board Meeting",
    "To consider the appointment of Chairman",
    "To consider leave of absence, if any",
    "To take note the minutes of the previous Board Meeting"
  ];

  businessOptions: string[] = [
    "To ratify the shorter notice for calling the Board Meeting",
    "To consider the appointment of Chairman",
    "To consider leave of absence, if any",
    "To take note the minutes of the previous Board Meeting"
  ];

  compLawMatters = [
    "To consider the appointment of Chairman",
    "To consider leave of absence, if any",
    "To take note the minutes of the previous Board Meeting"
  ];
  financeMatters = [];
  regulatoryMatters = [];
  businessMatters = [];

  particularsTableBody = [];
  directorsTableBody = [];
  inviteesTableBody = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private clientsService: ClientsService,
    private pdfService: PdfService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    this.clientsService.getClient(this.id)
      .subscribe(recdClient => {
        this.client = recdClient;
        this.selectedClient = this.client.compName
        this.bmAddrOptions.push(this.client.addr1 + ', ' + this.client.addr2 + ', ' + this.client.city + '-' + this.client.pincode )
        if(this.client.corpOffice) {
          this.bmAddrOptions.push(this.client.corpOffice.addr1 + ', ' + this.client.corpOffice.addr2 + ', ' + this.client.corpOffice.city + '-' + this.client.corpOffice.pincode )
        }
        if(this.client.directors) {
          this.dirDataSource = new MatTableDataSource(this.client.directors);
          this.clientDirectors = this.client.directors;
          this.recdDirDataSource = true;
          this.dirDataSource.paginator = this.dirTablePaginator;
          this.dirDataSource.sort = this.dirTableSort;
        }
        if(this.client.contacts) {
          console.log(this.client.contacts);
          this.contDataSource = new MatTableDataSource(this.client.contacts);
          this.selection = new SelectionModel<Person>(true, []);
          this.clientContacts = this.client.contacts;
          this.recdContDataSource = true;
          this.contDataSource.paginator = this.contTablePaginator;
          this.contDataSource.sort = this.contTableSort;
        }

        this.form = this.fb.group({
          bmSrNo: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
          bmDate: [null, Validators.required],
          bmTime:["", Validators.required],
          isShortNotice:false,
          bmAddr: "",
          compLawTopic: "",
          financeTopic: "",
          regulatoryTopic: "",
          businessTopic:"",
          signPlace:["", Validators.required],
          signDate:[null, Validators.required],
        });
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

  // applyDirFilter(event: Event) {
  //   const filterValue2 = (event.target as HTMLInputElement).value;
  //   this.dirDataSource.filter = filterValue2.trim().toLowerCase();

  //   if (this.dirDataSource.paginator) {
  //     this.dirDataSource.paginator.firstPage();
  //   }
  // }

  // applyContFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.contDataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.contDataSource.paginator) {
  //     this.contDataSource.paginator.firstPage();
  //   }
  // }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.contDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.contDataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Person): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.fName}`;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  onBmAddrSelection(addr: string) {
    this.selectedBmAddr = addr;
  }
  addNewBmAddr() {
    this.selectedBmAddr = this.form.value.bmAddr;
  }
  addCompLawTopic() {
    this.compLawMatters.push(this.form.value.compLawTopic);
    this.form.patchValue({compLawTopic: ""})
  }
  addFinanceTopic() {
    this.financeMatters.push(this.form.value.financeTopic);
    this.form.patchValue({financeTopic: ""})
  }
  addRegulatoryTopic() {
    this.regulatoryMatters.push(this.form.value.regulatoryTopic);
    this.form.patchValue({regulatoryTopic: ""})
  }
  addBusinessTopic() {
    this.businessMatters.push(this.form.value.businessTopic);
    this.form.patchValue({businessTopic: ""})
  }

  onSaveDoc() {
    this.selectedContacts = this.selection.selected;

    const savingBmNotice: BmNotice  = {
      userId: "userId1234",
      userName: "Some User",
      clientId: this.id,
      compName: this.client.compName,
      bmSrNo: this.form.value.bmSrNo.toUpperCase(),
      bmDate: this.form.value.bmDate,
      isShortNotice: this.form.value.isShortNotice,
      bmTime: this.form.value.bmTime.toUpperCase(),
      bmAddr: this.selectedBmAddr.toUpperCase(),
      compLawMatters: this.compLawMatters,
      financeMatters: this.financeMatters,
      regulatoryMatters: this.regulatoryMatters,
      businessMatters: this.businessMatters,
      signPlace: this.form.value.signPlace,
      signDate: this.form.value.signDate,
      invitees:  [{ id: " " }]
    }

  }

  onPreviewPDF() {
    const datePipe = new DatePipe('en-US');
    if(this.form.value.isShortNotice) {
      this.shortNotice = " AT A SHORT NOTICE"
    } else {
      this.shortNotice = ""
    }

    this.prepareParticularsTableBody();
    this.prepareDirectorsTableBody();
    this.prepareInviteesTableBody();

    const footerPrefix = this.client.compName + ' - ' + this.form.value.SrNo + ' Board Meeting Notice - '
    const docDef = {
      footer: function (currentPage, pageCount) {
        return {
          text: footerPrefix + 'Page ' + currentPage.toString() + " of " + pageCount, alignment: 'center',fontSize:8};
      },
      content: [
        {text: this.client.compName, style: 'pageHeader'},
        {table : {
            headerRows : 1, widths: ["100%"],
            body : [
              [''],
              ['']
            ]
          },
          layout : 'headerLineOnly'
        },
        {text: 'CIN: ' + this.client.CIN, style: 'pageSubHeader'},
        {text: "Regd Off: " + this.client.addr1 + " " + this.client.addr2, style: 'pageSubHeader'},
        {text: this.client.city + "-" + this.client.pincode + ", " + this.client.state, style: 'pageSubHeader'},
        {
          table : {
          headerRows : 1, widths: ["100%"],
          body : [
            [''],
            ['']
          ]
          },
          layout : 'headerLineOnly'
        },
        ' ',
        {text: 'To,'},
        {text: 'The Directors'},
        {text: 'NOTICE \n', style: 'pageTitle'},
        ' ',
        {alignment: 'justify',
          text:
          [
          'NOTICE IS HEREBY GIVEN THAT THE ',
          this.form.value.bmSrNo.toUpperCase(),
          ' MEETING OF THE BOARD OF DIRECTORS OF ',
          this.client.compName.toUpperCase(),
          ' IS TO BE HELD ON ',
          datePipe.transform(this.form.value.bmDate, 'fullDate').toUpperCase(),
          this.shortNotice,
          ' AT ',
          this.form.value.bmTime.toUpperCase(),
          ' AT ',
          this.selectedBmAddr.toUpperCase(),
          ' TO TRANSACT THE FOLLOWING BUSINESS:'
          ]
        },
        ' ',
        {
          style: 'table',
          table: {
            headerRows: 1,
            widths: ['auto', '*'],
            body: this.particularsTableBody,
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex === 0) ? '#dddddd' : null;
            },
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 1 : 0.5;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 1 : 0.5;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            },
          }
        },
        ' ',
        {alignment: 'justify',
          text: 'The Directors may kindly note that in compliance with Section 173(2) and 174(1) of the Companies Act, 2013 and Rule 3 of the Companies (Meetings of Board and its Powers) Rules, 2014, the Directors can avail the facility to attend the meeting through Video conferencing and such attendance will be considered for quorum. Director(s) wishing to attend the meeting through Video-conferencing, may please intimate the undersigned at the below mentioned contact details. We also wish to mention that in case of non-confirmati,on, it would be considered that the attendance would be through physical presence.' },
        ' ',
        'Kindly make it convenient to attend the meeting.',
        'Thanking you.',
        ' ',
        'Yours Faithfully,',
        {text: ['For ', this.client.compName ], bold: true},
        {text: '\n\n\n'},
        {text: 'Authorized Signatory', bold: true},
        {text: ['Place: ', this.form.value.signPlace.toUpperCase() ], bold: true},
        {text: [
          'Date: ',
          datePipe.transform(this.form.value.signDate, 'longDate').toUpperCase()
          ]
          , bold: true
        },
        'Encl: Agenda',
        '\n\n\n\n',
        {
          style: 'table',
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*'],
            body: this.directorsTableBody,
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex === 0) ? '#dddddd' : null;
            },
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 1 : 0.5;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 1 : 0.5;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            },
          }
        },
        '\n\n',
        {
          style: 'table',
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*'],
            body: this.inviteesTableBody,
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex === 0) ? '#dddddd' : null;
            },
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 1 : 0.5;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 1 : 0.5;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            },
          }
        },

      ],

      styles: {
        pageHeader: {
          fontSize: 16,
          bold: true,
          alignment: 'center'
        },
        pageSubHeader: {
          fontSize: 12,
          alignment: 'center'
        },
        pageTitle: {
          fontSize: 14,
          alignment: 'center'
        },
        table: {
          margin: [5, 10]
        },
        tableHeader: {
          bold: true,
          fillColor: 'black',
          color: 'white'
        },
        defaultStyle: {
          fontSize: 11
        }
      }
    }

    this.pdfService.generatePdf(docDef);

  }

  private prepareParticularsTableBody(){
    this.particularsTableBody = [
      ['Sr.No.', {text: 'Particulars', alignment: 'center', fillColor: '#dddddd'}],
      [
        {text:' ', fillColor: '#eeeeee'},
        {text: 'Company Law Matters', italics: true, decoration: 'underline', alignment: 'center', fillColor: '#eeeeee'}],
      ]
      let i = 0
      if(this.compLawMatters.length > 0){
        this.compLawMatters.forEach(e => {
          i = i+1;
          this.particularsTableBody.push([i, e ])
        });
      } else {
        this.particularsTableBody.push([" ", " --- None --- "])
      }

      this.particularsTableBody.push([
        {text: ' ', fillColor: '#eeeeee'},
        {text: 'Finance and Accounts Matters', italics: true, decoration: 'underline', alignment: 'center', fillColor: '#eeeeee'}
      ])
      if(this.financeMatters.length > 0){
        this.financeMatters.forEach(e => {
          i = i+1;
          this.particularsTableBody.push([i, e ])
        });
      } else {
        this.particularsTableBody.push([" ", " --- None --- "])
      }

      this.particularsTableBody.push([
        {text: ' ', fillColor: '#eeeeee'},
        {text: 'Regulatory Matters', italics: true, decoration: 'underline', alignment: 'center', fillColor: '#eeeeee'}
      ])
      if(this.regulatoryMatters.length > 0){
        this.regulatoryMatters.forEach(e => {
          i = i+1;
          this.particularsTableBody.push([i, e ])
        });
      } else {
        this.particularsTableBody.push([" ", " --- None --- "])
      }

      this.particularsTableBody.push([
        {text: ' ', fillColor: '#eeeeee'},
        {text: 'Business Matters', italics: true, decoration: 'underline', alignment: 'center', fillColor: '#eeeeee'}
      ])
      if(this.businessMatters.length > 0){
        this.businessMatters.forEach(e => {
          i = i+1;
          this.particularsTableBody.push([i, e ])
        });
      } else {
        this.particularsTableBody.push([" ", " --- None --- "])
      }
      this.particularsTableBody.push([" ", " "])
      this.particularsTableBody.push([" ", "Any other business with the permission of the chair"])

  }

  private prepareDirectorsTableBody() {
    this.directorsTableBody = [
      [ 'Sr.No.', 'Name of Director', 'Email Id','Contact Number']
    ];
    let i = 0;
    if(this.client.directors.length > 0){
      this.client.directors.forEach(e => {
        i = i+1;
        this.directorsTableBody.push([
          i, e.fName + " " + e.lName, e.email, e.mobile1
            ])
      });
    } else {
      this.directorsTableBody.push([" ", " --- None --- ", " ", " "])
    }
  }

  private prepareInviteesTableBody() {
    this.selectedContacts = this.selection.selected
    this.inviteesTableBody = [
      [ 'Sr.No.', 'Name of Invitee', 'Email Id','Contact Number']
      ];
    let i = 0;
    if(this.selectedContacts.length > 0){
      this.selectedContacts.forEach(e => {
        i = i+1;
        this.inviteesTableBody.push([
          i, e.fName + " " + e.lName, e.email, e.mobile1
        ])
      });
    } else {
      this.inviteesTableBody.push([" ", " --- None --- ", " ", " "])
    }
  }


}
