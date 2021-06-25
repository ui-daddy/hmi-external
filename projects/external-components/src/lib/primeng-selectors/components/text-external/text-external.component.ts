import { Component, Input, OnInit } from '@angular/core';
import { PrimeNgText } from '../../models/primeng-text';


@Component({
  selector: 'hmi-ext-text-external',
  templateUrl: './text-external.component.html',
  styleUrls: ['./text-external.component.scss']
})
export class TextExternalComponent implements OnInit {

  @Input() fieldObj: any;
  @Input() dynamicAttributes: any;

  fieldProperties: PrimeNgText;

  constructor() { 
    this.fieldProperties = new PrimeNgText(null);
  }

  ngOnInit(): void {
    this.fieldProperties = new PrimeNgText(this.fieldObj.customAttributes);
  }

}
