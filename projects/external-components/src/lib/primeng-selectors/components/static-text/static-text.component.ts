import { Component, ElementRef, Input, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';


@Component({
  selector: 'hmi-ext-static-text',
  templateUrl: './static-text.component.html',
  styleUrls: ['./static-text.component.css']
})
export class StaticTextComponent extends CommonExternalComponent implements OnDestroy, AfterViewInit  {

  keyArr: Array<String>;
  eventSubscriptionArr: any;

  constructor() {
    super();
    this.keyArr = [];
   }

   ngOnInit() {
    if (this.fieldObj.dynamicValueMap && this.fieldObj.dynamicValueMap.length) {
      for (let i = 0; i < this.fieldObj.dynamicValueMap.length; i++) {
        this.keyArr.push(this.fieldObj.dynamicValueMap[i].value);
      }
    } 
  }

  ngOnDestroy() {
    this.eventSubscriptionArr?.forEach((subObj:any) => {
      subObj.unsubscribe();
    });
    this.eventSubscriptionArr = null;
  }

}
