import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { of as observableOf } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DeleteConfirmDialogComponent } from 'src/app/dialogs/delete-confirm-dialog.component';
import { Employee } from 'src/app/_models/employee.model';
import { EmployeesService } from '../employees.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['title', 'fName', 'lName', 'desig', 'coEmail', 'mobile1', 'mobile2', 'delete', 'edit'];
  dataSource: MatTableDataSource<Employee>;
  employees: Employee[] = [];
  isLoading = false;
  totalCount = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private employeesService: EmployeesService, private dialog: MatDialog) {}

  ngOnInit() {
    this.isLoading = true
    this.employeesService.getEmployees('', '', 'asc', 0, 5)
      .pipe(
        map(recdData => {
          this.isLoading = false;
          this.totalCount = recdData.totalCount;
          return recdData.employees;
        }),
        catchError(() => {
          this.isLoading = false;
          return observableOf([])
        })
      )
      .subscribe(recdEmployees => {
        this.employees = recdEmployees;
        this.dataSource = new MatTableDataSource(this.employees);
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

    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDelete(id: string) {
    let dialogRef = this.dialog.open(DeleteConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result === 'yes') {
        return this.employeesService.deleteEmployee(
          id,
          this.input.nativeElement.value,
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize
          )
          .pipe(
            map(recdData => {
              this.isLoading = false;
              this.totalCount = recdData.totalCount;
              return recdData.employees;
            }),
            catchError(() => {
              this.isLoading = false;
              return observableOf([])
            })
          )
          .subscribe(recdEmployees => {
            this.employees = recdEmployees;
            this.dataSource.data = this.employees;
          });
      }
    });
  }


}
