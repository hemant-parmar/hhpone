import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientSaveComponent } from './client-save/client-save.component';

const moduleComponents = [
  ClientSaveComponent,
  ClientListComponent
]
@NgModule({
  declarations: [moduleComponents],
  imports: [RouterModule, CommonModule, ReactiveFormsModule, MaterialModule],
  exports: [moduleComponents]
})
export class ClientsModule {}
