import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ElementRef, ViewChild  } from '@angular/core';
import * as _ from "lodash";
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { ACTION_TYPE } from '../../../interfaces/hmi-events';

@Component({
  selector: 'hmi-char-text',
  templateUrl: './char-text.component.html',
  styleUrls: ['./char-text.component.scss']
})


export class CharTextComponent extends CommonExternalComponent implements OnInit, OnDestroy {
  @Input() isTemplateOnly = false;
  data: any;
  debounceValueChange: Subject<void|string> = new Subject();
  subscription: any;

  constructor() {
    super();
  }
  ngOnInit() {
    this.debounceValueChange.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.onValueChange();
    });
    this.subscription = this.fieldObj.action.subscribe((actionObj: any) => {
      if (actionObj.actionType === ACTION_TYPE.CLEAR_COMPONENT_DATA) {
        this.clearValue();
      }
    });
  }

  applyLabelPlacementClass() {
    let className = 'input-label__placement-top';
    if (this.fieldObj.layoutProperties.labelPlacement
       && this.fieldObj.layoutProperties.labelPlacement.toLowerCase() === 'left') {
      className = 'input-label__placement-left';
    }

    return className;
  }

  onValueChange() {
    console.log('I am in onValueChange()');
    let dynamicAttributes;
    if(!this.isTemplateOnly
      && this.fieldObj.value !== this.formGroupObj.value[this.fieldObj.baseProperties.name]) { //Value change should be triggered only if actual value has changed.
        dynamicAttributes = _.cloneDeep(this.dynamicAttributes);
        if (dynamicAttributes) dynamicAttributes.value = this.formGroupObj.value[this.fieldObj.baseProperties.name];
      this._dataChange.emit({ dynamicData: dynamicAttributes });
      if (this.formGroupObj.value[this.fieldObj.baseProperties.name] !== null) {
        this.fieldObj.onValueChange && this.fieldObj.onValueChange.actions
          && this._dataChange.emit({ actions: this.fieldObj.onValueChange.actions });
      }
    }
  }

  clearValue() {
    this.formGroupObj?.get(this.fieldObj?.baseProperties?.name)?.setValue(null);
    const dynamicAttributes = _.cloneDeep(this.dynamicAttributes);
    if (dynamicAttributes) dynamicAttributes.value = null;
    this._dataChange.emit({ dynamicData: dynamicAttributes });
    this.fieldObj.onValueClear && this.fieldObj.onValueClear.actions
      && this._dataChange.emit({ actions: this.fieldObj.onValueClear.actions });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
