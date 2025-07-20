import { Component, OnInit, Input, Output, EventEmitter, forwardRef, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { UntypedFormGroup } from '@angular/forms';
import * as _ from "lodash";
import { NgbDatepickerConfig, NgbDateStruct, NgbTimeStruct, NgbDatepickerI18n, NgbDatepicker, NgbInputDatepicker, NgbTimepicker, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ACTION_TYPE } from '../../../interfaces/hmi-events';
import { Observable } from 'rxjs';
import * as moment from 'moment-timezone';

@Component({
  selector: 'hmi-ext-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.css']
})
export class DateTimeComponent extends CommonExternalComponent implements OnInit, OnDestroy {

  isTemplateOnly: boolean = false;
  @ViewChild(NgbTimepicker, { static: true }) picker!: NgbTimepicker;

  eventSubscriptionArr: any;

  formGroupObj!: UntypedFormGroup;
  navigateToDate: NgbDateStruct | null = null;
  datePickerConfig!: NgbDatepickerConfig;
  dayMap: any;
  loadingCalendarConfig = false;

  constructor(private config: NgbDatepickerConfig, public i18n: NgbDatepickerI18n) { 
    super();
    this.datePickerConfig = config;
  }

  ngOnInit(): void {
    this.subscription = this.fieldObj.action.subscribe((actionObj:any) => {
      if (actionObj.actionType === ACTION_TYPE.CLEAR_COMPONENT_DATA) {
        this.clearValue();
      }
    });

    if (this.fieldObj.baseProperties.type === 'time') {
      const timepickerCtrl = this.formGroupObj.get(this.fieldObj.baseProperties.id);
      timepickerCtrl?.valueChanges.subscribe((value:any)=>{
        const errors: { [key: string]: boolean } = {};
        if (this.dynamicAttributes?.requiredValue && timepickerCtrl.errors && timepickerCtrl.errors.required) {
          errors['required'] = true;
        }

        if (timepickerCtrl.touched &&  ((!isNaN(this.picker.model!.hour) && 
        isNaN(this.picker.model!.minute)) || (isNaN(this.picker.model!.hour) && !isNaN(this.picker.model!.minute)))) {
          errors['invalid'] = true;
        }
        this.picker.model?.minute
        timepickerCtrl.setErrors(_.isEmpty(errors) ? null : errors);
      })
    }
    //Inline Datepicker configs
    const currentDate = new Date();
    this.datePickerConfig.startDate = {year: currentDate.getFullYear(), month: currentDate.getMonth()+1};
    if (this.fieldObj.dataConfig && this.fieldObj.dataConfig.url) {       
      this.loadData({year: currentDate.getFullYear(), month: currentDate.getMonth()+1, day: currentDate.getDate()});
    } else {
      this.datePickerConfig.maxDate = this.fieldObj.maxDate!; 
      this.datePickerConfig.minDate = this.fieldObj.minDate!;
    }    
  }

  //Disable days if not current month
  //In case of data from API, disable any days not present in the response.  
  isDisabled = (date: NgbDate, current?: {month: number}) => {
    if (date.month !== current?.month) {
      return true;
    }
    if (this.fieldObj.dataConfig && this.fieldObj.dataConfig.url) {
      if (!this.dayMap || !this.getDayConfigFromBackendData(date)) {
        return true;
      } else {
        return false;
      }         
    } else {
      return false;
    }
  };

  loadData(date: NgbDateStruct) {    
    this.loadingCalendarConfig = true;
    const CUSTOM_FIELD_OBJECT =  {
      SELECTED_MONTH: date
    };
    return this.customApiCall!(this.fieldObj.dataConfig, CUSTOM_FIELD_OBJECT).subscribe( (data:any) => { 
      this.dayMap = data;
      this.loadingCalendarConfig = false;
    });
  }

  onMonthChange(event:any) {
    this.datePickerConfig.startDate = event.next;
    if (this.fieldObj.dataConfig && this.fieldObj.dataConfig.url && event.current) {
      event.next.day = 1;
      this.navigateToDate = event.next;
      this.loadData(event.next);
    } else if (this.navigateToDate) {
      this.navigateToDate = null;
    } 
  }

  onValueChange() {
    if (this.formGroupObj.get(this.fieldObj.baseProperties.name)?.valid) {    
      console.log('I am in onValueChange()');
      let dynamicAttributes;
      if (!this.isTemplateOnly
        && this.fieldObj.value !== this.formGroupObj.value[this.fieldObj.baseProperties.name]) { //Value change should be triggered only if actual value has changed.
        dynamicAttributes = _.cloneDeep(this.dynamicAttributes);
        dynamicAttributes!.value = this.formGroupObj.value[this.fieldObj.baseProperties.name];
        this._dataChange.emit({ dynamicData: dynamicAttributes });
        if (this.formGroupObj.get(this.fieldObj.baseProperties.name)?.value !== null) {
          this.fieldObj.onValueChange && this.fieldObj.onValueChange.actions 
            && this._dataChange.emit({ actions: this.fieldObj.onValueChange.actions });
        }
        if(this.primeElement.close){
          this.primeElement.close();       
        }
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

   //Placeholder methods for custom Inline date-picker

   onDateSelect(date: NgbDateStruct) {
    // TODO show popup
    //alert(date);    
}

backgroundStyle(date: NgbDateStruct): any {
  if (!this.dayMap) {
    return {};
  }
  
  const mapValueObj = this.getDayConfigFromBackendData(date);
  if (!mapValueObj) {
    return {};
  }

  let cssObj;
  for (const dayConfig of this.fieldObj.calendarDayConfig) {
    if (mapValueObj[dayConfig.accessor] === dayConfig.value) {
      cssObj = dayConfig.backgroundCss;
      break;
    }
  }
  if (!cssObj) {
    console.error("Background css for calendar not mapped properly.");
    return {};
  }
  return {
    "color": cssObj.color,
    "parent-background-color": cssObj.backgroundColor,
    "border-color": cssObj.borderColor
  };
}

//This method should be called only if data from backend exists
getDayConfigFromBackendData(date: NgbDateStruct) {
  let mapKey;
  if (!this.fieldObj.timezone) {
    mapKey = (new Date(date.year, date.month - 1, date.day).getTime()).toString();      
  } else {
    //Fixing confusion between 2 digit and single digit month
    mapKey = moment.tz(""+date.year+"-"+date.month+"-"+date.day, "YYYY-M-D", this.fieldObj.timezone);
    mapKey = mapKey ? mapKey.valueOf() : 0;
  }
  return this.dayMap[mapKey];    
}

ngOnDestroy() {
  this.subscription.unsubscribe();
}

}
