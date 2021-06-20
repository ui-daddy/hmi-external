import { Component, Input, OnInit } from '@angular/core';
import { Password } from 'primeng/password';

@Component({
  selector: 'hmi-ext-password-external',
  templateUrl: './password-external.component.html',
  styleUrls: ['./password-external.component.scss']
})
export class PasswordExternalComponent implements OnInit {

  @Input()
  inputPropsMapping: any = {};

  value1: string = "testing";

  constructor() { }

  ngOnInit(): void {
  }

}
