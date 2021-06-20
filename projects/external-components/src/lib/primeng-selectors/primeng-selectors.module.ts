import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordExternalComponent } from './components/password-external/password-external.component';
import { TextExternalComponent } from './components/text-external/text-external.component';
import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {AccordionModule} from 'primeng/accordion';


@NgModule({
  declarations: [
    PasswordExternalComponent,
    TextExternalComponent
  ],
  imports: [
    CommonModule, FormsModule, PasswordModule, InputTextModule, AccordionModule
  ],
  exports: [
    PasswordExternalComponent,
    TextExternalComponent,
    AccordionModule
  ]
})
export class PrimengSelectorsModule { }

//Create BaseProperties class for hmi-external
