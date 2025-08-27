import { Component, Input, Output, EventEmitter, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from "lodash";
import { CommonExternalComponent } from '../common-external/common-external.component';
import { ACTION_TYPE } from '../../../interfaces/hmi-events';
import { EventType } from '../../../constants/constants';

interface IOption {
  label: string,
  value: string
}
@Component({
  selector: 'hmi-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent extends CommonExternalComponent implements OnDestroy {
  optionList: any[] | undefined;
  @Input() isTemplateOnly: boolean = false;
  showLoader = false;
  subscription: any;
  selectedValue: any;
  formattedOptionList: IOption[] = [];

  constructor() {
    super();
  }

  ngOnInit() {
    this.selectedValue = this.dynamicAttributes?.value;
    this.subscription = this.fieldObj.action.subscribe((actionObj: any) => {
      if (actionObj.actionType === ACTION_TYPE.RELOAD_COMPONENT_DATA) {
        this.loadData();
      } else if (actionObj.actionType === ACTION_TYPE.CLEAR_COMPONENT_DATA) {
        this.clearValue();
        if (actionObj.options && actionObj.options.clearList) {
          this.clearList();
        }
      }     
    });
    if (this.fieldObj.optionsConfig && this.fieldObj.optionsConfig.fetch === EventType.ONLOAD && this.dynamicAttributes?.visibleValue) {
      this.loadData();
    } else if (this.fieldObj.optionList?.length ) {
      this.loadStaticData();
    }
  }
  loadStaticData() {
    this.loadFromOptionList();
  }

  loadData() {    
    this.clearList();
    this.showLoader = true;        
    this.customApiCall?.(this.fieldObj.optionsConfig).subscribe((data: any) => {
      this.fieldObj.optionList = data;  //TODO: this is an immutable object which shouldnt be modified
      this.loadFromOptionList();
    }, (err: any) => {
      this.fieldObj.optionList = [];
      this.showLoader = false;
      console.error(err);
    });
  }

  loadFromOptionList() {
    this.showLoader = false;
    this.formattedOptionList = this.optionsFormatter(this.fieldObj.optionList );
    let selectedOption = _.find(this.formattedOptionList, { value: this.selectedValue?.hasOwnProperty("value") ? this.selectedValue.value : this.selectedValue});
    this.formService?.updateFieldValuebyName(this.fieldObj.baseProperties.formName, this.fieldObj.baseProperties.name, selectedOption);
    this.selectChangeHandler();
  }

  selectChangeHandler() {
    let dynamicAttributes:any,
      formValue = this.formGroupObj.value[this.fieldObj.baseProperties.name],
      dAttrVal = this.dynamicAttributes?.value;

    if(!this.isTemplateOnly
      && !_.isEqual(dAttrVal, formValue)) { 
      dynamicAttributes = _.cloneDeep(this.dynamicAttributes);
      dynamicAttributes.value = this.formGroupObj.value[this.fieldObj.baseProperties.name];
      this._dataChange.emit({ dynamicData: dynamicAttributes });
      if (this.formGroupObj.value[this.fieldObj.baseProperties.name] !== null) { //If null clear actions are already triggered
        this.fieldObj.onValueChange && this.fieldObj.onValueChange.actions 
          && this._dataChange.emit({ actions: this.fieldObj.onValueChange.actions });
      }
    }
  }

  applyLabelPlacementClass() {
    let className = 'input-label__placement-top';
    if (this.fieldObj.layoutProperties.labelPlacement
       && this.fieldObj.layoutProperties.labelPlacement.toLowerCase() === 'left') {
      className = 'input-label__placement-left';
    }

    return className;
  }

  clearValue() {
    this.formGroupObj.get(this.fieldObj.baseProperties.name).setValue(null);
    let dynamicAttributes = _.cloneDeep(this.dynamicAttributes);
    if (dynamicAttributes) dynamicAttributes.value = null;
    this._dataChange.emit({ dynamicData: dynamicAttributes });  
    this.fieldObj.onValueClear && this.fieldObj.onValueClear.actions 
      && this._dataChange.emit({ actions: this.fieldObj.onValueClear.actions });  
  }

  clearList() {
    this.fieldObj.optionList = [];
  }

  optionsFormatter(optionList: any) {
    if(optionList?.length) {

      return optionList.map((optionObj: any) => {
        let modifiedOptionObj = {
          label: _.get(optionObj, this.fieldObj.labelKey),
          value: _.get(optionObj, this.fieldObj.valueKey)
        }
        return modifiedOptionObj;
      });
    }
    return [{label:"", value:""}];
  }

  compareFn(option1: any, option2: any) {
    return option1 && option2 ? option1.label === option2.label : option1 === option2;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
