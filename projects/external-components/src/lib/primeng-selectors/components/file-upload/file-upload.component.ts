import {Component, Input, OnDestroy, OnInit, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import { ACTION_TYPE } from '../../../interfaces/hmi-events';
import { CommonExternalComponent } from '../common-external/common-external.component';
import * as _ from "lodash";
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {UntypedFormGroup} from "@angular/forms";

@Component({
  selector: 'hmi-ext-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent extends CommonExternalComponent  implements OnInit, OnDestroy, AfterViewInit {

  isTemplateOnly = false;
  formGroupObj!: UntypedFormGroup;
  subscription: any;
  @ViewChild('inputLabel') inputLabel!: ElementRef;
  @ViewChild('fileRef') fileRef!: ElementRef;

  constructor() { 
    super()
  }

  ngOnInit(): void {
    this.subscription = this.fieldObj.action.subscribe((actionObj:any) => {
      if (actionObj.actionType === ACTION_TYPE.CLEAR_COMPONENT_DATA) {
        this.clearValue();
      }
    });
  }

  ngAfterViewInit() {
    if (this.dynamicAttributes?.value?.name) {
      this.inputLabel.nativeElement.innerHTML = this.dynamicAttributes.value.name;
    } 
  }

  applyLabelPlacementClass() {
    let className = 'input-label__placement-top';
    if (this.fieldObj.layoutProperties.labelPlacement
       && this.fieldObj.layoutProperties.labelPlacement.toLowerCase() === 'left') {
      className = 'input-label__placement-left';
    }

    return className;
  }

  onValueChange(event:any) {
    console.log('I am in onValueChange()');
    if(!this.isTemplateOnly
      && this.fieldObj.value !== this.formGroupObj.value[this.fieldObj.baseProperties.name]) { //Value change should be triggered only if actual value has changed.
        const reader = new FileReader();
        reader.onload = this.handleFileLoad.bind(this, event.target.files[0]);
        reader.readAsText(event.target.files[0]);
    }
  }

  handleFileLoad(file: File, event:any) {
    let dynamicAttributes = _.cloneDeep(this.dynamicAttributes);
    if (!dynamicAttributes) {
      //dynamicAttributes = {};
    }
    dynamicAttributes!.value = {
      name: file?.name,
      lastModified: file?.lastModified,
      size: file?.size,
      type: file?.type,
      fakePath: this.formGroupObj.value[this.fieldObj.baseProperties.name],
      data: event.target.result,
      file: file
    };
    this._dataChange.emit({ dynamicData: dynamicAttributes });
    if (this.formGroupObj.value[this.fieldObj.baseProperties.name] !== null) {
      this.fieldObj.onValueChange && this.fieldObj.onValueChange.actions
      && this._dataChange.emit({ actions: this.fieldObj.onValueChange.actions });
    }
    this.inputLabel.nativeElement.innerHTML = file?.name;
  }

  clearValue() {
    this.formGroupObj.get(this.fieldObj.baseProperties.name)?.setValue(null);
    const dynamicAttributes = _.cloneDeep(this.dynamicAttributes);
    dynamicAttributes!.value = null;
    this._dataChange.emit({ dynamicData: dynamicAttributes });
    this.fieldObj.onValueClear && this.fieldObj.onValueClear.actions
    && this._dataChange.emit({ actions: this.fieldObj.onValueClear.actions });
    this.inputLabel.nativeElement.innerHTML = "Choose file";
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
