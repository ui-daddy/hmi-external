import { AfterViewInit, Component, DoCheck, ElementRef, Input, KeyValueDiffer, KeyValueDiffers, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'hmi-ext-dropdown-external',
  templateUrl: './dropdown-external.component.html',
  styleUrls: ['./dropdown-external.component.css']
})
export class DropdownExternal implements OnInit, AfterViewInit {

  private _fieldObj: any;
  public get fieldObj() {
    return this._fieldObj;
  }
  @Input()
  public set fieldObj(theFieldObj: any) {
    this._fieldObj = theFieldObj;

    //Passing dataKey in customAttributes causes data to not load once below code is executed
    Object.assign(this.primeDropdown, this._fieldObj.customAttributes);
  }  
  
  //@Input() fieldObj: any;
  @Input() dynamicAttributes: any;
  @Input() formGroupObj: any;

  @ViewChild('primeDropdown', {static: true}) primeDropdown!: any;

  constructor() { }

  ngOnInit(): void {    
    console.log("Options: "+JSON.stringify(this._fieldObj.customAttributes.optionList));
  }

  ngAfterViewInit(): void {
    // for (const [key, value] of Object.entries(this.fieldObj.customAttributes)) {
    // }
    //Object.assign(this.primeDropdown, this._fieldObj.customAttributes);
    // this.fieldObj.customAttributes.forEach( (customObject: CustomAttribute) => {
    //   //this.primeDropdown.instance[customObject.name] = customObject.value;
    //   console.log(customObject.value); 
    //   //this.primeDropdown[customObject.name] = customObject.value;     
    // // });
    // this.primeDropdown;
    // setTimeout(()=>{
    //   this.primeDropdown.options.push({name: "delhi", value: "delhi", label: "Delhi"});
    //   console.log("Value changed");
    // }, 5000);
  }
}
