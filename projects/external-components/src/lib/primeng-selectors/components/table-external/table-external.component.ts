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
    this.fieldObj.customAttributes.loading = true;
    if (this.fieldObj.customAttributes.dataConfig && this.fieldObj.customAttributes.dataConfig.url) {
      this.commonService.getData(this.fieldObj.customAttributes.dataConfig.url).then((data: any) => {
        if (this.fieldObj.customAttributes.dataConfig.onSuccess && this.fieldObj.customAttributes.dataConfig.onSuccess.apiDataAccessor 
            && data[this.fieldObj.customAttributes.dataConfig.onSuccess.apiDataAccessor]) {
          this.data = data[this.fieldObj.customAttributes.dataConfig.onSuccess.apiDataAccessor];
        } else {
          this.data = data;
        }
      }).finally(() => this.fieldObj.customAttributes.loading = false);
    }
  }

  applyGlobalFilter($event: Event, stringVal: string) {
    this.primeElement!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }
}
