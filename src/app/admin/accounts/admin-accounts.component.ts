import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of as observableOf } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, first, map } from 'rxjs/operators';

import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { Account } from 'src/app/_models/account.model';
import { AccountService } from 'src/app/account/account.service';
import { AlertService } from 'src/app/alert/alert.service';
import { EmployeesService } from 'src/app/employees/employees.service';

@Component({
  selector: 'app-admin-accounts',
  templateUrl: './admin-accounts.component.html'
})
export class AdminAccountsComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  submitted = false;
  id: string;
  editMode: boolean;
  openExpPanel = false;

  nonuserEmployees = []

  displayedColumns: string[] = ['userName', 'employeeName', 'role', 'delete', 'edit'];
  dataSource: MatTableDataSource<Account>;
  accounts: Account[] = [];
  totalCount = 0;
  selected;
  empEmail;
  empId;
  empName;
  hide = true;
  savingAccount = {
    employeeId: '',
    employeeName: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
    role: ''
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private alertService: AlertService,
    private employeesService: EmployeesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      // employeeName: ['', Validators.required],
      employeeId: ['', Validators.required],
      // email: [{value: '', disabled: true }, Validators.required],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
      }, { validator: MustMatch('password', 'confirmPassword')}
    );

    this.employeesService.getNonUserEmployees()
      .subscribe(emps => {
        this.nonuserEmployees = Object.values(emps);
      });

    this.accountService.getAll()
    .pipe(
      map(accounts => {
        if(!accounts) {
          accounts = []
        }
        this.isLoading = false;
        return accounts;
      }),
      catchError(() => {
        this.isLoading = false;
        return observableOf([])
      })
    )
    .subscribe(accounts => {
      this.accounts = accounts
      this.totalCount = this.accounts.length;
      this.dataSource = new MatTableDataSource(this.accounts);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  get f() { return this.form.controls; }

  onSelected() {
    this.empId = this.selected;
    const selectedEmp = this.nonuserEmployees.find(el => el._id === this.selected)
    this.empEmail = selectedEmp.coEmail;
    this.empName = selectedEmp.fName + " " + selectedEmp.lName;
  }

  onSubmit() {
    this.savingAccount = {
      employeeId: this.form.value.employeeId,
      employeeName: this.empName,
      email: this.empEmail,
      userName: this.form.value.userName,
      password: this.form.value.password,
      confirmPassword: this.form.value.confirmPassword,
      role: this.form.value.role
    }
    this.submitted = true;
    this.alertService.clear();
    if(this.form.invalid) {
      console.log('Invalid Form');
      return
    };
    this.isLoading = true;
    if(this.editMode) {
      this.updateAccount();
    } else {
      this.createAccount();
    }

  }

  private createAccount() {
    this.accountService.create(this.savingAccount)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Account created successfully', {keepAfterRouteChange: true});
          this.router.navigate([''])  /// decide what needs to be done after creating acct
        },
        error: error => {
          this.alertService.error(error);
          this.isLoading = false;
        }
      });
  }

  private updateAccount() {
    this.accountService.update(this.id, this.savingAccount)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Account update successful', {keepAfterRouteChange: true});
          this.router.navigate([''])  /// decide what needs to be done after updating acct
        }
      });
  }

  onClearExpPanel() {
    // reset form
    this.form.reset();
    this.editMode = false;
    this.empEmail = "";
  }

  onCancelExpPanel() {
    this.onClearExpPanel();
    this.openExpPanel = false;
  }

  onEdit() {
  }

  onDelete() {

  }


}
