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
  }

  applyGlobalFilter($event: Event, stringVal: string) {
    this.primeElement!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  refreshTable() {
    this.fieldObj.customAttributes.loading = true;
    if (this.fieldObj.customAttributes.dataConfig && this.fieldObj.customAttributes.dataConfig.url) {
      this.customApiCall(this.fieldObj.customAttributes.dataConfig).subscribe((data: any) => {
        if (this.fieldObj.customAttributes.dataConfig.onSuccess && this.fieldObj.customAttributes.dataConfig.onSuccess.apiDataAccessor 
            && data[this.fieldObj.customAttributes.dataConfig.onSuccess.apiDataAccessor]) {
          this.data = data[this.fieldObj.customAttributes.dataConfig.onSuccess.apiDataAccessor];
        } else {
          this.data = data;
        }
        this.fieldObj.customAttributes.loading = false;
      });
    }
  }

  cellAction(colConfig: any, rowData: any) {
    if (colConfig.action) {
      if (colConfig.action.name === "ROW_ACTION" && colConfig.action.apiConfig && colConfig.action.apiConfig.url) {
        this.customApiCall(colConfig.action.apiConfig, rowData).subscribe(() => { 
          console.log("Row action performed successfully.");
          // let dynamicAttributes = _.cloneDeep(this.dynamicAttributes);
          // if (colConfig.actionObj.apiConfig.onSuccess && colConfig.actionObj.apiConfig.onSuccess.deleteTableRow) {
          //   dynamicAttributes.value = _.reject(dynamicAttributes.value, rowData);
          // }
          // this._dataChange.emit({ dynamicData: dynamicAttributes });
        })
      }
    }
  }
}
