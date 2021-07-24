import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'hmi-ext-password-external',
  templateUrl: './password-external.component.html',
  styleUrls: ['./password-external.component.scss']
})
export class PasswordExternalComponent extends CommonExternalComponent {
  constructor() { 
    super();
  }
}
