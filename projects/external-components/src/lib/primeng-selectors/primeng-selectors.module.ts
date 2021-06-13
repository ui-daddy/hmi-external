import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordExternalComponent } from './password-external/password-external.component';
import {PasswordModule} from 'primeng/password';


@NgModule({
  declarations: [
    PasswordExternalComponent
  ],
  imports: [
    CommonModule, FormsModule, PasswordModule
  ],
  exports: [
    PasswordExternalComponent
  ]
})
export class PrimengSelectorsModule { }

//Create BaseProperties class for hmi-external
