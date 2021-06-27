import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { PrimeNgTable } from '../../models/primeng-table';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'hmi-ext-table-external',
  templateUrl: './table-external.component.html',
  styleUrls: ['./table-external.component.scss']
})
export class TableExternalComponent implements OnInit {

  @Input() fieldObj: any;
  @Input() dynamicAttributes: any;
  @ViewChild('dt') dt: Table | undefined;

  data: any = [];

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.fieldObj.customAttributes.loading = true;
    this.fieldObj.customAttributes = new PrimeNgTable(this.fieldObj.customAttributes);
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
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }
}
