import {Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
@Component({
  selector: 'hmi-ext-static-image',
  templateUrl: './static-image.component.html',
  styleUrls: ['./static-image.component.css']
})
export class StaticImageComponent extends CommonExternalComponent implements OnInit {

  eventSubscriptionArr: any;

  constructor() { 
    super();
  }

  ngOnInit(): void {
    if (this.fieldObj.accessor) {
      this.fieldObj.imageUrl = this.fieldObj.value;
    }
  }

}
