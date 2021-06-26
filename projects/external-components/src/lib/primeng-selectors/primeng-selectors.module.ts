import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordExternalComponent } from './components/password-external/password-external.component';
import { TextExternalComponent } from './components/text-external/text-external.component';
import { TableExternalComponent } from './components/table-external/table-external.component';
import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {AccordionModule} from 'primeng/accordion';
import {TableModule} from 'primeng/table';


@NgModule({
  declarations: [
    PasswordExternalComponent,
    TextExternalComponent,
    TableExternalComponent
  ],
  imports: [
    CommonModule, FormsModule, PasswordModule, InputTextModule, AccordionModule, TableModule
  ],
  exports: [
    PasswordExternalComponent,
    TextExternalComponent,
    TableExternalComponent,
    AccordionModule, TableModule
  ]
})
export class PrimengSelectorsModule { }

//Create BaseProperties class for hmi-external
