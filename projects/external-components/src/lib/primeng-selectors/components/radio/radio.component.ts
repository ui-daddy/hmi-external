import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { UntypedFormGroup } from '@angular/forms';
import * as _ from "lodash";
@Component({
  selector: 'hmi-ext-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css']
})
export class RadioComponent extends CommonExternalComponent implements OnInit {

  isTemplateOnly:boolean = false;
  optionList!: any[] ;

  constructor() {
    super();
   }

  ngOnInit(): void {
    this.optionList = this.fieldObj.optionList;
    const index = _.findIndex(this.optionList, { value: (this.dynamicAttributes?.value) && this.dynamicAttributes?.value?.hasOwnProperty("value") && this.dynamicAttributes!.value.value });
    this.dynamicAttributes!.value = this.optionList[index];  //Assignment from the list required to set default selected
  }

  onValueChange(value:any) {
    if(!this.isTemplateOnly
      && (!this.formGroupObj.value[this.fieldObj.baseProperties.name] 
        || this.formGroupObj.value[this.fieldObj.baseProperties.name].value !== value.value)) { //Value change should be triggered only if actual value has changed.
        console.log("LHS = " + this.fieldObj.getValue());
        console.log("RHS = " + this.formGroupObj.value[this.fieldObj.baseProperties.name]);
        this.dynamicAttributes!.value = value;
      const dynamicAttributes = _.cloneDeep(this.dynamicAttributes);
      this._dataChange.emit({ dynamicData: dynamicAttributes });
      this.fieldObj.onValueChange && this.fieldObj.onValueChange.actions 
        && this._dataChange.emit({ actions: this.fieldObj.onValueChange.actions });
    }
    
  }

  applyLabelPlacementClass() {
    let className = 'input-label__placement-top';
    if (this.fieldObj.layoutProperties.labelPlacement && this.fieldObj.layoutProperties.labelPlacement.toLowerCase() === 'left') {
      className = 'input-label__placement-left';
    }
    
    return className;
  }

}
