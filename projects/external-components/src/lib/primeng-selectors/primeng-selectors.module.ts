import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordExternalComponent } from './components/password-external/password-external.component';
import { TextExternalComponent } from './components/text-external/text-external.component';
import { TableExternalComponent } from './components/table-external/table-external.component';
import {TableModule} from 'primeng/table';
import { DropdownExternal } from './components/dropdown-external/dropdown-external.component';
import { ChartsExternalComponent } from './components/charts-external/charts-external.component';

import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import { ToggleButton, ToggleButtonModule } from 'primeng/togglebutton';
import {ChartModule} from 'primeng/chart';


@NgModule({
  declarations: [
    PasswordExternalComponent,
    TextExternalComponent,
    TableExternalComponent,
    DropdownExternal,
    ChartsExternalComponent
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, PasswordModule, InputTextModule, 
    TableModule, DropdownModule, ToggleButtonModule, ChartModule
  ],
  exports: [
    PasswordExternalComponent,
    TextExternalComponent,
    TableExternalComponent,
    TableModule,
    DropdownExternal,
    ChartsExternalComponent, PasswordModule, DropdownModule
  ],
  entryComponents: [
    ToggleButton
  ]
})
export class PrimengSelectorsModule { }

//Create BaseProperties class for hmi-external
