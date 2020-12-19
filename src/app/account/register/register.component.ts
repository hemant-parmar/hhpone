import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/alert/alert.service';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      employeeName: ['', Validators.required],
      employeeId: ['', Validators.required],
      email: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: MustMatch('password', 'confirmPassword')}
    );
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    if(this.form.invalid) return;

    this.isLoading = true;
    this.accountService.register(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Registration successful. Please ask the Employee to check email for verification instructions.', { keepAfterRouteChange: true });
          this.router.navigate(['/'])
        },
        error: error => {
          this.alertService.error(error);
          this.isLoading = false;
        }
      });

  }
}
