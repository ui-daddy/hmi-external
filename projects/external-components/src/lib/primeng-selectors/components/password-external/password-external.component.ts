import { Component, Input, OnInit } from '@angular/core';
import { PrimeNgPassword } from '../../models/primeng-password';

@Component({
  selector: 'hmi-ext-password-external',
  templateUrl: './password-external.component.html',
  styleUrls: ['./password-external.component.scss']
})
export class PasswordExternalComponent implements OnInit {

  @Input() fieldObj: any;
  @Input() dynamicAttributes: any;

  fieldProperties: PrimeNgPassword;

  constructor() {
    this.fieldProperties = new PrimeNgPassword(null);
  }

  ngOnInit(): void {
    this.fieldProperties = new PrimeNgPassword(this.fieldObj.customAttributes);
  }

}
