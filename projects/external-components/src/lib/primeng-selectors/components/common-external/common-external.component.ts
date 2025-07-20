import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, ViewChildren } from '@angular/core';
import { FieldDynamicAttributes } from '../../../interfaces/dynamic-comp-interface';
import { UrlConfiguration } from '../../../interfaces/url-configuration';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

interface FormsService {
  updateFieldValuebyName(formName: any, fieldName: any, value: any): void;
  isFormValid(fieldObj:any): any;
}
@Component({
  selector: 'hmi-ext-common-external',
  template: ''
})
export class CommonExternalComponent implements AfterViewInit {

  private _fieldObj: any;
  public isDirective: boolean = false;
  private isEventInitialized = false;
  public get fieldObj() {
    return this._fieldObj;
  }
  @Input()
  public set fieldObj(theFieldObj: any) {
    this._fieldObj = theFieldObj;
    if (this.primeElement) {
      Object.assign(this.isDirective? this.primeElement?.nativeElement : this.primeElement, this._fieldObj.customAttributes);
    }
  }
  @Input() dynamicAttributes: FieldDynamicAttributes | undefined;
  @Input() formGroupObj: any;
  @Input() customApiCall: ((searchConfig: UrlConfiguration, CUSTOM_FIELD_OBJECT?: any) => Observable<any>) | undefined;
  @Input() formService: FormsService | undefined;
  @Output('initializeEvents') protected initializeEvents = new EventEmitter<any>();
  @Output('dataChange') protected _dataChange = new EventEmitter<any>();

  @ViewChildren('primeElements') primeElements!: any; 
  @ViewChild('primeElement') primeElement!: any; 
  subscription: any;

  constructor() { }

  ngAfterViewInit() {
    if (this.primeElements?.length) {
      this.primeElement = this.primeElements.first;
    }
    if (this.primeElement) {
      const nativeElement = this.primeElement?.nativeElement || (this.primeElement.input && this.primeElement.input.nativeElement);
      if (nativeElement) {
        nativeElement.readOnly = this.dynamicAttributes?.readOnlyValue;
      } else {
        this.primeElement.readonly = this.dynamicAttributes?.readOnlyValue;
      }
    }

    if (!this.isEventInitialized) {
      this.isEventInitialized = true;
      this.initializeEvents.emit();
    }
  } 
}
