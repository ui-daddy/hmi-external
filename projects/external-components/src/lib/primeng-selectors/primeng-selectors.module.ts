import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordExternalComponent } from './components/password-external/password-external.component';
import { TextExternalComponent } from './components/text-external/text-external.component';
import { DropdownExternal } from './components/dropdown-external/dropdown-external.component';

import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {AccordionModule} from 'primeng/accordion';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';


@NgModule({
  declarations: [
    PasswordExternalComponent,
    TextExternalComponent,
    DropdownExternal
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, PasswordModule, InputTextModule, AccordionModule, DropdownModule, CheckboxModule
  ],
  exports: [
    PasswordExternalComponent,
    TextExternalComponent,
    AccordionModule,
    DropdownExternal, PasswordModule, DropdownModule, CheckboxModule
  ]
})
export class PrimengSelectorsModule { }

//Create BaseProperties class for hmi-external
