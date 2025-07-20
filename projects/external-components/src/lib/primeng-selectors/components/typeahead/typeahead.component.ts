import { Component, OnInit, Input, ViewChild, EventEmitter, Output, OnDestroy, AfterViewInit } from '@angular/core';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';

import { Subject, Observable, merge, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { UntypedFormGroup } from '@angular/forms';
import * as _ from "lodash";
import { ACTION_TYPE } from '../../../interfaces/hmi-events';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'hmi-ext-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.css']
})
export class TypeaheadComponent extends CommonExternalComponent  implements OnInit {
  initialValue: any;
  isTemplateOnly: boolean = false;

  constructor() {
    super();
  }

  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  initialSearchSubscription!: Subscription;

   ngOnInit() {
    this.initialValue = this.fieldObj.value;
    // if (this.fieldObj.value && !this.fieldObj.value[this.fieldObj.displayKey] 
    //   && (typeof this.fieldObj.value) === 'string' ) {
    //   this.initialSearchSubscription = this.getSearchData(this.fieldObj.value).subscribe( (dropdownList:any) => {
    //     const matchIndex = _.findIndex(dropdownList, { [this.fieldObj.outputKey]: this.fieldObj.value });
    //     if (matchIndex > -1) {
    //       this.dynamicAttributes!.value = dropdownList[matchIndex];
    //     }
    //     this.formGroupObj = this.formService?.createInputControl(this.fieldObj, this.dynamicAttributes);        
    //   });
    // } else {
    //   this.formGroupObj = this.formService.createInputControl(this.fieldObj, this.dynamicAttributes);
    // }
    this.subscription = this.fieldObj.action.subscribe((actionObj:any) => {
      if (actionObj.actionType === ACTION_TYPE.CLEAR_COMPONENT_DATA) {
        this.clearValue();
      }
    });
  }

  reset() {
    this.fieldObj.value = _.cloneDeep(this.initialValue);
  }

  search = (text$: Observable<string>) => {
    this.initialSearchSubscription && this.initialSearchSubscription.unsubscribe();
    const debouncedText$ = text$.pipe(debounceTime(300), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.primeElement.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      switchMap(this.getSearchData)
    );
  }

  private getSearchData = (searchText:any) => {
    if (searchText.length < this.fieldObj.searchMinLength) {
      return of([]);
    }
    if (this.fieldObj.searchConfig) {     
      const CUSTOM_FIELD_OBJECT =  {
        SEARCH_TEXT: searchText
      };
      return this.customApiCall!(this.fieldObj.searchConfig, CUSTOM_FIELD_OBJECT);
    } else {
      if (searchText === '') {  //true only if searchMinLength = 0
        return of(this.fieldObj.optionList);
      } else {
        return of(this.fieldObj.optionList).pipe( map(optionList => 
          optionList.filter((v:any) => v[this.fieldObj.displayKey].toLowerCase().indexOf(searchText.toLowerCase()) > -1).slice(0, 10)));        
      }
    }
  }

  formatter = (result: any) => {
    return result[this.fieldObj.displayKey];
  };

  onValueChange(item:any) {
    console.log('Selected Item: '+item.item.label );
    this.formGroupObj.value[this.fieldObj.baseProperties.name] = item.item;
    let dynamicAttributes;
    if(!this.isTemplateOnly
      && this.fieldObj.value !== this.formGroupObj.value[this.fieldObj.baseProperties.name]) { //Value change should be triggered only if actual value has changed.
      dynamicAttributes = _.cloneDeep(this.dynamicAttributes);
      dynamicAttributes!.value = item.item;
      this._dataChange.emit({ dynamicData: dynamicAttributes });
      if (this.formGroupObj.value[this.fieldObj.baseProperties.name] !== null) {
        this.fieldObj.onValueChange && this.fieldObj.onValueChange.actions 
          && this._dataChange.emit({ actions: this.fieldObj.onValueChange.actions });
      }
    }
  }

  applyLabelPlacementClass() {
    let className = 'input-label__placement-top';
    if (this.fieldObj.layoutProperties.labelPlacement && this.fieldObj.layoutProperties.labelPlacement.toLowerCase() === 'left') {
      className = 'input-label__placement-left';
    }
    
    return className;
  }

  clearValue() {
    this.formGroupObj.get(this.fieldObj.baseProperties.name).setValue(null);
    const dynamicAttributes = _.cloneDeep(this.dynamicAttributes);
    dynamicAttributes!.value = null;
    this._dataChange.emit({ dynamicData: dynamicAttributes });   
    this.fieldObj.onValueClear && this.fieldObj.onValueClear.actions 
      && this._dataChange.emit({ actions: this.fieldObj.onValueClear.actions }); 
  }

}
