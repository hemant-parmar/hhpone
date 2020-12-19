import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Employee } from 'src/app/_models/employee.model';
import { EmployeesService } from '../employees.service';

@Component({
  selector: 'app-employee-save',
  templateUrl: './employee-save.component.html',
  styleUrls: ['./employee-save.component.css']
})
export class EmployeeSaveComponent implements OnInit {
  form: FormGroup;
  employee: Employee;
  editMode = false;
  isLoading = false;
  titleString = 'ADDING'
  private id: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private employeesService: EmployeesService) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      fName: ['', Validators.required],
      lName: ['', Validators.required],

      desig: [''],
      coEmail: ['', [Validators.required, Validators.email]],
      personalEmail: ['', Validators.email],
      mobile1: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
        Validators.min(1000000000), Validators.max(9999999999)]],
      mobile2: ['', [Validators.pattern("^[0-9]*$"), Validators.min(1000000000),
        Validators.max(9999999999)]],
      gender: [''],
      dob: [null],

      qualifications: [''],
      band: [''],
      ctc: [''],
      dateOfJoining: [null],
      experienceStartDate: [null],
      leftCompany: [false],
      dateOfLeaving: [null],

      pan: [''],
      addr1: [''],
      addr2: [''],
      city: [''],
      state: [''],
      pincode: [''],
      contactPersonName: [''],
      contactPersonMobile: [''],
      userName: ['']
    });

    if(this.editMode) {
      this.titleString = 'EDITING'
      this.employeesService.getEmployee(this.id)
        .subscribe(recdEmployee => {
          this.employee = recdEmployee;
          if (!this.employee.userName) {
            this.employee.userName = '';
          }
          this.form.patchValue(this.employee);
        });
    }

  }

  onEmployeeSave() {
    if(this.form.invalid) {
      alert('Mandatory Employee Data is not entered');
      return;
    };

    const savingEmployee = this.form.value;

    if(this.editMode) {
      this.employeesService.updateEmployee(this.id, savingEmployee)
    } else {
      this.employeesService.addEmployee(savingEmployee);
    }
  }

}
