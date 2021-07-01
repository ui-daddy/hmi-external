import { Component, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PrimeNgDropdown } from '../../models/primeng-dropdown';

@Component({
  selector: 'hmi-ext-dropdown-external',
  templateUrl: './dropdown-external.component.html',
  styleUrls: ['./dropdown-external.component.css']
})
export class DropdownExternal implements OnInit {

  @Input() fieldObj: any;
  @Input() dynamicAttributes: any;
  @Input() formGroupObj: any;

  @Output() onChange: any;  

  fieldProperties: PrimeNgDropdown;
  selectedValue: any;

  constructor() {
    this.fieldProperties = new PrimeNgDropdown(null);
  }

  ngOnInit(): void {    
    this.fieldProperties = new PrimeNgDropdown(this.fieldObj.customAttributes);    
    console.log("Options: "+JSON.stringify(this.fieldProperties.optionList));
    this.selectedValue = this.fieldObj.value;    
  }

  onDropdownChange(event: any): void {
    console.log("Selected value: "+event.value);
    this.onChange(event.value);
  }

}
