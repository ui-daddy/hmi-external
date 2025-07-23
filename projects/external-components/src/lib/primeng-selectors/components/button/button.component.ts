import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonExternalComponent } from '../common-external/common-external.component';
@Component({
  selector: 'hmi-ext-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent extends CommonExternalComponent implements OnInit {

  defaultClass!: string;
  spinnerTime!: string;
  state = {
    loading: false,
    showTimer: false,
    disabled: false
  };


  public eventAction(event:any, fieldObj:any) {
    /**
     * Sequence - First actions will get executed, then redirection will happen
     * If we are showing timer, navigate is not applicable. So it is in end.
     */
    if (this.fieldObj.href && this.fieldObj.href.length) {
      return;
    }
    event.preventDefault();
    if (Array.isArray(this.fieldObj.navigateToPage)) {      
      this._dataChange.emit({ customRedirect: this.fieldObj.navigateToPage });      
      return;      
    } else if (this.fieldObj.navigateToPage && this.fieldObj.navigateToPage.length) {
      this.router.navigate([this.fieldObj.navigateToPage], { relativeTo: this.route });
      return;
    } 
    

    if (this.fieldObj.onClick) {
      if (this.fieldObj.onClick.disabled) {
        this.state.disabled = true;
      }

      if (this.fieldObj.onClick.timer && !isNaN(this.fieldObj.onClick.timer.value)) {
        if (this.fieldObj.onClick.timer.visibility) {
          this.state.showTimer = true;
        }
        let timerInSeconds = (+this.fieldObj.onClick.timer.value) / 1000;
        this.spinnerTime = timerInSeconds + 's';
        setTimeout(() => {
            this.state.showTimer = false;
            if (this.fieldObj.onClick.timer.enableAfterExpire) {
              this.state.disabled = false;
            }
        }, timerInSeconds * 1000);
      }

      if (this.fieldObj.onClick.showLoaderOnClick) {
        this.state.loading = true;
      };
    }   
    
    /*if (this.fieldObj.baseProperties.type.toLowerCase() === 'submit' && this.formService.isFormValid(this.fieldObj)) {
      const dataToSend = {
        state: this.state,
        fieldObj: this.fieldObj,
        fieldsStatus: this.formService.getAllFieldValidationStatus(this.fieldObj.baseProperties.formName)
      }
      this._dataChange.emit({ submitFormData: dataToSend });
    } else if (this.fieldObj.baseProperties.type.toLowerCase() === 'reset') {
      this.formService.resetFormByName(this.fieldObj.baseProperties.formName);
    } else {

    }*/
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    ) {
    super()
   }

  ngOnInit(): void {
    this.defaultClass = 'btn ' + (this.fieldObj.layoutProperties.css && this.fieldObj.layoutProperties.css.themeClass
      ? this.fieldObj.layoutProperties.css.themeClass
      : 'btn-primary');  
  }

  isFormValid(): boolean {
    return !this.state.disabled && (this.fieldObj.baseProperties.type === 'submit' ? (this.formService?.isFormValid(this.fieldObj) && !this.dynamicAttributes?.disabledValue) : !this.dynamicAttributes?.disabledValue);
  }

}
