import { Component, OnInit, Input, Output, EventEmitter, forwardRef, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { UntypedFormGroup } from '@angular/forms';
import * as _ from "lodash";
import { ACTION_TYPE } from '../../../interfaces/hmi-events';
import { Observable } from 'rxjs';
import * as moment from 'moment';



@Component({
  selector: 'hmi-ext-date-with-time',
  templateUrl: './date-with-time.component.html',
  styleUrl: './date-with-time.component.css'
})
export class DateWithTimeComponent extends CommonExternalComponent implements OnInit, OnDestroy {

  isTemplateOnly: boolean = false;
  datetime: Date[] | any;
  dateViewFormat!: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.dateViewFormat = this.fieldObj.customAttributes.dateViewFormat;
    this.subscription = this.fieldObj.action.subscribe((actionObj: any) => {
      if (actionObj.actionType === ACTION_TYPE.CLEAR_COMPONENT_DATA) {
        this.clearValue();
      }
    });

    if (this.fieldObj && this.fieldObj.baseProperties && this.fieldObj.baseProperties.name) {
      const dateTimeValue = this.formGroupObj.get(this.fieldObj.baseProperties.name)?.value;
      if (dateTimeValue) {
        const momentDate = moment.tz(dateTimeValue, this.fieldObj.customAttributes.dateInputFormat, this.fieldObj.customAttributes.dateInputTimezone); //"DD/MM/YYYY, hh:mm A", "asia/kolkata"
        this.datetime = momentDate.toDate();
        this.formGroupObj.get(this.fieldObj.baseProperties.name)?.setValue(this.datetime);
      }
    }
  }

  onValueChange() {
    if (this.fieldObj.baseProperties.type === 'date-time') {
      const dateTimeValue = this.formGroupObj.get(this.fieldObj.baseProperties.name)?.value;
      if (dateTimeValue) {
        this.datetime = new Date(dateTimeValue);
      } else {
        this.datetime = undefined;
      }
    }
  }

  clearValue() {
    this.formGroupObj.get(this.fieldObj.baseProperties.name)?.setValue(null);
    const dynamicAttributes = _.cloneDeep(this.dynamicAttributes);
    dynamicAttributes!.value = null;
    this._dataChange.emit({ dynamicData: dynamicAttributes });
    this.fieldObj.onValueClear && this.fieldObj.onValueClear.actions
      && this._dataChange.emit({ actions: this.fieldObj.onValueClear.actions });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
