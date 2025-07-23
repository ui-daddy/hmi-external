import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonExternalComponent } from '../common-external/common-external.component';
@Component({
  selector: 'hmi-ext-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent extends CommonExternalComponent implements OnInit {

  currentRoute!: string;
  optionList: any;

  constructor(private router: Router) {
    super();
   }

   ngOnInit(): void { 
    this.optionList = this.fieldObj.optionList;
    this.fieldObj;
    this.currentRoute = this.router.url.split('?')[0] + "/";
  }
  public eventAction(event:any, fieldObj:any) {
    /**
     * Sequence - First actions will get executed, then redirection will happen
     * If we are showing timer, navigate is not applicable. So it is in end.
     */
    if (this.fieldObj.href && this.fieldObj.href.length) {
      return;
    }
    let navEvents;
    if (fieldObj.events && fieldObj.events.length) {
      navEvents = JSON.parse(JSON.stringify(fieldObj.events));
      this.initializeEvents.emit({ name: "fireEvent", events: navEvents, data: null});
    }
  }
  sendValueToParent(newFieldObj:any) {
    this._dataChange.emit(newFieldObj);
  }

}
