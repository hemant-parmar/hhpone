import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { AdminAccountsComponent } from './admin/accounts/admin-accounts.component';
import { AlertComponent } from './alert/alert.component';
import { BoardMeetingNoticeComponent } from './csdocs/board-meeting-notice/board-meeting-notice.component';
import { ClientsModule } from './clients/clients.module';
import { CreateDocComponent } from './csdocs/create-doc/create-doc.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeleteConfirmDialogComponent } from './dialogs/delete-confirm-dialog.component';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { EmployeeSaveComponent } from './employees/employee-save/employee-save.component';
import { ForgotPasswordComponent } from './account/forgot-password/forgot-password.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ResetPasswordComponent } from './account/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent, HeaderComponent,
    DeleteConfirmDialogComponent, AlertComponent,
    EmployeeSaveComponent, EmployeeListComponent,
    LoginComponent, AdminAccountsComponent,
    ForgotPasswordComponent, ResetPasswordComponent, ResetPasswordComponent,
    DashboardComponent, CreateDocComponent, BoardMeetingNoticeComponent,
    RegisterComponent
  ],
  entryComponents: [DeleteConfirmDialogComponent],
  imports: [
    HttpClientModule, BrowserModule,  BrowserAnimationsModule, ReactiveFormsModule,
    MaterialModule, DragDropModule, AppRoutingModule, ClientsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
