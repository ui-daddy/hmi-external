import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { CommonExternalComponent } from '../common-external/common-external.component';


@Component({
  selector: 'hmi-ext-text-external',
  templateUrl: './text-external.component.html',
  styleUrls: ['./text-external.component.scss']
})
export class TextExternalComponent extends CommonExternalComponent {
  constructor() { 
    super();
    this.isDirective = true;
  }
}
