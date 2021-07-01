import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordExternalComponent } from './components/password-external/password-external.component';
import { TextExternalComponent } from './components/text-external/text-external.component';
import { TableExternalComponent } from './components/table-external/table-external.component';
import {AccordionModule} from 'primeng/accordion';
import {TableModule} from 'primeng/table';
import { DropdownExternal } from './components/dropdown-external/dropdown-external.component';

import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';


@NgModule({
  declarations: [
    PasswordExternalComponent,
    TextExternalComponent,
    TableExternalComponent,
    DropdownExternal
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, PasswordModule, InputTextModule, AccordionModule, TableModule, DropdownModule, CheckboxModule
  ],
  exports: [
    PasswordExternalComponent,
    TextExternalComponent,
    TableExternalComponent,
    AccordionModule, TableModule,
    DropdownExternal, PasswordModule, DropdownModule, CheckboxModule
  ]
})
export class PrimengSelectorsModule { }

//Create BaseProperties class for hmi-external
