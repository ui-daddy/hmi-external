import { Component, Input, OnInit } from '@angular/core';
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

  fieldProperties: PrimeNgTable;
  data: any = [];

  constructor(private commonService: CommonService) { 
    this.fieldProperties = new PrimeNgTable(null);
  }

  ngOnInit(): void {
    this.fieldProperties = new PrimeNgTable(this.fieldObj.customAttributes);
    if (this.fieldProperties.dataConfig && this.fieldProperties.dataConfig.url) {
      this.commonService.getData(this.fieldProperties.dataConfig.url).then((data: any) => {
        if (this.fieldProperties.dataConfig.onSuccess && this.fieldProperties.dataConfig.onSuccess.apiDataAccessor && data[this.fieldProperties.dataConfig.onSuccess.apiDataAccessor]) {
          this.data = data[this.fieldProperties.dataConfig.onSuccess.apiDataAccessor];
        } else {
          this.data = data;
        }
      });
    }
  }

}
