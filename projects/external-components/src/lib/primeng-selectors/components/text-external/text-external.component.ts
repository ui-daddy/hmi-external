import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'hmi-ext-text-external',
  templateUrl: './text-external.component.html',
  styleUrls: ['./text-external.component.scss']
})
export class TextExternalComponent {

  @Input() fieldObj: any;
  @Input() dynamicAttributes: any;

  constructor() { }
}
