import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { InputText } from 'primeng/inputtext';


@Component({
  selector: 'hmi-ext-text-external',
  templateUrl: './text-external.component.html',
  styleUrls: ['./text-external.component.scss']
})
export class TextExternalComponent implements AfterViewInit {

  private _fieldObj: any;
  public get fieldObj() {
    return this._fieldObj;
  }
  @Input()
  public set fieldObj(theFieldObj: any) {
    this._fieldObj = theFieldObj;

    //Passing dataKey in customAttributes causes data to not load once below code is executed
    Object.assign(this.primeText, this._fieldObj.customAttributes);
  }
  @Input() dynamicAttributes: any;

  @ViewChild(InputText, {static: true}) primeText!: any; 

  constructor() { }

  ngAfterViewInit(): void {    
    //this.fieldObj.customAttributes.disabled = true;    
  }
}
