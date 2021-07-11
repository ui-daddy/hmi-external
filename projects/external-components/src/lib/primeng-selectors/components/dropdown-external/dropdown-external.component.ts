import { AfterViewInit, Component, DoCheck, ElementRef, Input, KeyValueDiffer, KeyValueDiffers, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'hmi-ext-dropdown-external',
  templateUrl: './dropdown-external.component.html',
  styleUrls: ['./dropdown-external.component.css']
})
export class DropdownExternal implements OnInit, DoCheck, AfterViewInit {

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

  @Output() onChange: any;

  @ViewChild('primeDropdown', {static: true}) primeDropdown!: any;
  selectedValue: any;

  constructor(private differs: KeyValueDiffers) {
    //this.fieldObjDiffer = this.differs.find(this.fieldObj).create();
   }

  ngOnInit(): void {    
    console.log("Options: "+JSON.stringify(this._fieldObj.customAttributes.optionList));
    this.selectedValue = this._fieldObj.value;
    //this.fieldObjDiffer = this.differs.find(this.fieldObj).create();        
  }

  ngAfterViewInit(): void {
    // for (const [key, value] of Object.entries(this.fieldObj.customAttributes)) {
    // }
    //Object.assign(this.primeDropdown, this._fieldObj.customAttributes);
    // this.fieldObj.customAttributes.forEach( (customObject: CustomAttribute) => {
    //   //this.primeDropdown.instance[customObject.name] = customObject.value;
    //   console.log(customObject.value); 
    //   //this.primeDropdown[customObject.name] = customObject.value;     
    // });
    this.primeDropdown;
    setTimeout(()=>{
      //this.primeDropdown.optionLabel = "label123";
      //this.fieldProperties.optionLabel = "label"
      //console.log("Value changed");
    }, 5000);
  }

  // ngOnChanges(changes: any): void {
  //   console.log(JSON.stringify(changes));
  // }
  ngDoCheck(): void {
    // const changes = this.fieldObjDiffer.diff(this.fieldObj);
    // if (changes) {
    //   console.log(JSON.stringify(changes));
    // } 
    console.log("In Do Check");   
  }

  onDropdownChange(event: any): void {
    console.log("Selected value: "+event.value);
    this.onChange(event.value);
  }

}
