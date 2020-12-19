import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './account/forgot-password/forgot-password.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ResetPasswordComponent } from './account/reset-password/reset-password.component';
import { AdminAccountsComponent } from './admin/accounts/admin-accounts.component';
import { ClientListComponent } from './clients/client-list/client-list.component';
import { ClientSaveComponent } from './clients/client-save/client-save.component';
import { BoardMeetingNoticeComponent } from './csdocs/board-meeting-notice/board-meeting-notice.component';
import { CreateDocComponent } from './csdocs/create-doc/create-doc.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { EmployeeSaveComponent } from './employees/employee-save/employee-save.component';

const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'client/list', component: ClientListComponent},
  { path: 'client/add', component: ClientSaveComponent},
  { path: 'client/edit/:id', component: ClientSaveComponent},
  { path: 'employees', component: EmployeeListComponent},
  { path: 'employees/edit', component: EmployeeSaveComponent},
  { path: 'employees/edit/:id', component: EmployeeSaveComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'admin', component: AdminAccountsComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'create-doc', component: CreateDocComponent},
  { path: 'bmNotice/:id', component: BoardMeetingNoticeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
