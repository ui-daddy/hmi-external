import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hmi-ext-password-external',
  templateUrl: './password-external.component.html',
  styleUrls: ['./password-external.component.scss']
})
export class PasswordExternalComponent {

  @Input() fieldObj: any;
  @Input() dynamicAttributes: any;

  constructor() { }
}
