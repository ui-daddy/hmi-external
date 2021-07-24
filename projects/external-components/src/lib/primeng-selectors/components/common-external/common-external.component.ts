import { Component, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'hmi-ext-common-external',
  template: ''
})
export class CommonExternalComponent {

  private _fieldObj: any;
  public isDirective: boolean = false;
  public get fieldObj() {
    return this._fieldObj;
  }
  @Input()
  public set fieldObj(theFieldObj: any) {
    this._fieldObj = theFieldObj;
    Object.assign(this.isDirective? this.primeElement.nativeElement : this.primeElement, this._fieldObj.customAttributes);  
  }
  @Input() dynamicAttributes: any;
  @Input() formGroupObj: any;

  @ViewChild('primeElement', {static: true}) primeElement!: any; 

  constructor() { }
}
