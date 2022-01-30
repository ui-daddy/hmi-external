import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommonExternalComponent } from '../common-external/common-external.component';


@Component({
  selector: 'hmi-ext-table-external',
  templateUrl: './table-external.component.html',
  styleUrls: ['./table-external.component.scss']
})
export class TableExternalComponent extends CommonExternalComponent implements OnInit {
  data: any = [];

  constructor(private commonService: CommonService) { 
    super();
  }

  ngOnInit(): void {
    this.refreshTable();
    this.subscription = this.fieldObj.action.subscribe((actionObj: any) => {
      if (actionObj.actionType === "RELOAD_COMPONENT_DATA") {
        this.refreshTable();
      }      
    });
  }

  applyGlobalFilter($event: Event, stringVal: string) {
    this.primeElement!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  refreshTable() {
    this.fieldObj.customAttributes.loading = true;
    if (this.fieldObj.customAttributes.dataConfig && this.fieldObj.customAttributes.dataConfig.url) {
      this.customApiCall(this.fieldObj.customAttributes.dataConfig).subscribe((data: any) => {        
        this.data = data;
        this.fieldObj.customAttributes.loading = false;
      });
    }
  }

  cellAction(colConfig: any, rowData: any) {
    if (colConfig.action) {
      if (colConfig.action.name === "ROW_ACTION" && colConfig.action.apiConfig && colConfig.action.apiConfig.url) {
        this.customApiCall(colConfig.action.apiConfig, rowData).subscribe(() => { 
          console.log("Row action performed successfully.");
        });
      }
    }
    let colEvents;
    if (colConfig.events && colConfig.events.length) {
      colEvents = JSON.parse(JSON.stringify(colConfig.events));
      colEvents.forEach((event: any) => {
        event.actions.forEach((action: any) => {
          if (action.actionType === "SET_SHARED_DATA" && action.sharedData && action.sharedData.length) {
            action.sharedData.forEach((shareDataObj: any) => {
              if (shareDataObj.staticData === "$ROW_DATA$") {
                shareDataObj.staticData = rowData;
              }
            });
          }
        });
      });
      this.initializeEvents.emit({ name: "fireEvent", events: colEvents, data: rowData});
    }
  }
  
}
