import {Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';


@Component({
  selector: 'hmi-ext-static-icon',
  templateUrl: './static-icon.component.html',
  styleUrls: ['./static-icon.component.css']
})
export class StaticIconComponent extends CommonExternalComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }
  
}