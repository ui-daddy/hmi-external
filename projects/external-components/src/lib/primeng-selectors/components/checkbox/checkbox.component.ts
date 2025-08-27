import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { CommonExternalComponent } from '../common-external/common-external.component';
import * as _ from "lodash";
import { EventType } from '../../../constants/constants';

@Component({
  selector: 'hmi-ext-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent extends CommonExternalComponent implements OnInit {
  
  // TODO: Remove name from optionList object
  optionList!: any[] ;
  formGroupObj!: UntypedFormGroup;
  isTemplateOnly: boolean = false;
  selectedValue: any;
  showLoader!: boolean;
  formattedOptionList: any;

  constructor() { 
    super();
  }

  ngOnInit(): void {
    this.optionList = this.fieldObj.optionList;
  }
  
  onValueChange(valObj:any, event:any) {
    if(!this.isTemplateOnly) { 
      if (event.target.checked) {
        if (!Array.isArray(this.dynamicAttributes?.value)) {
          this.dynamicAttributes!.value = [];
        }
        this.dynamicAttributes?.value.push(valObj);
        
      } else {
        const index = _.findIndex(this.dynamicAttributes?.value, { value: valObj.value });
        if (!Array.isArray(this.dynamicAttributes?.value)) {
          this.dynamicAttributes!.value = [];
        }
        this.dynamicAttributes?.value.splice(index, 1);
      }
      
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
