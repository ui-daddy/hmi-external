import { Component, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

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
  selectedValue: any;

  constructor() { }

  ngOnInit(): void {    
    console.log("Options: "+JSON.stringify(this.fieldObj.customAttributes.optionList));
    this.selectedValue = this.fieldObj.value;    
  }

  onDropdownChange(event: any): void {
    console.log("Selected value: "+event.value);
    this.onChange(event.value);
  }

}
