import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { CommonExternalComponent } from '../common-external/common-external.component';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'hmi-ext-table-external',
  templateUrl: './table-external.component.html',
  styleUrls: ['./table-external.component.scss']
})
export class TableExternalComponent extends CommonExternalComponent implements OnInit {
  data: any = [];

  constructor(private commonService: CommonService, private router: Router) { 
    super();
  }

  ngOnInit(): void {
    this.refreshTable(true);
    this.subscription = this.fieldObj.action.subscribe((actionObj: any) => {
      if (actionObj.actionType === "RELOAD_COMPONENT_DATA") {
        this.refreshTable();
      }
      if (actionObj.actionType === "setfield") {
        this.data = actionObj.data;
      }
      if (actionObj.actionType === "SHOW_COMPONENT_LOADER") {
        this.primeElement.loading = true;
      }
      if (actionObj.actionType === "HIDE_COMPONENT_LOADER") {
        this.primeElement.loading = false;
      }
    });
  }

  applyGlobalFilter($event: Event, stringVal: string) {
    this.primeElement!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  refreshTable(isOnLoad?: boolean) {
    if (this.fieldObj.customAttributes?.triggerFilterGroupOnRefresh && !isOnLoad) {
      this.initializeEvents.emit({ name: "fireEvent", events: [
        {
          "event": "click",
          "actions": [{
            "actionType": "RELOAD_COMPONENT_DATA",
            "componentName": this.fieldObj.customAttributes?.triggerFilterGroupOnRefresh
          }]
        }
      ], data: null});
    } else {
      this.primeElement.loading = true;
      if (this.fieldObj.customAttributes.dataConfig && this.fieldObj.customAttributes.dataConfig.url) {
        this.customApiCall(this.fieldObj.customAttributes.dataConfig).subscribe((data: any) => {
          this.data = data;
          this.primeElement.loading = false;
        });
      }
    }
  }

  cellAction(colConfig: any, rowData: any) {
    if (colConfig.action) {
      if (colConfig.action.name === "ROW_ACTION") {
        if(colConfig.action.apiConfig && colConfig.action.apiConfig.url) {
          this.primeElement.loading = true;
          this.customApiCall(colConfig.action.apiConfig, rowData).subscribe(() => { 
            console.log("Row action performed successfully.");
          }, (err: any) => {
            console.error(err);
          }).add(() => {
            this.primeElement.loading = false;
          });
        }
        if (colConfig.action.pageUrl) {
          this.router.navigate([colConfig.action.pageUrl, rowData.id]);
        }
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

  exportPdf() {
    import("jspdf").then((jsPDF:any) => {
        import("jspdf-autotable").then((autotable:any) => {
            const exportColumns:any[] = [];
            this.fieldObj.customAttributes.columns.forEach((v:any)=> {
              if(v.accessor) {
                exportColumns.push({
                  title: v.colName,
                  dataKey: v.accessor
                });
              }
            });
            const doc = new jsPDF.default(0,0);
            // doc.autoTable(exportColumns, this.data);
            const options = {
              body: this.data,
              columns: exportColumns,
              headStyles: { fontStyle: 'bold', cellWidth: 'wrap' }
            }
            autotable.default.default(doc, options);
            const fileName = this.fieldObj.customAttributes.downloadPdfFileName || 'downloadedPdf';
            doc.save(fileName+'.pdf');
        })
    })
  }

  printPreview() {
    // Add a CSS class to the element you want to print
    const originalElement = document.getElementById('tableExternal-'+this.fieldObj.baseProperties.id);
    const newWindow = window.open('', '_open');
    if (originalElement && newWindow) {
        newWindow.document.write('<link rel="stylesheet" type="text/css" href="styles.css" onload="onCssLoad()">');
        newWindow.document.write('<script> function onCssLoad(){ window.print();}</script>');
        newWindow.document.write('<html><head><title>Print Preview</title></head>');
        newWindow.document.write('<style>@media print { .d-print-none, .p-datatable-header { display: none; } }</style>');
        newWindow.document.write('<body>');
        newWindow.document.write(originalElement.outerHTML);
        newWindow.document.write('</body></html>');
        newWindow.document.close();
    }
  }

  exportExcel() {
      import("xlsx").then(xlsx => {
          const customHeaders: string[] = []; // list of custom header names
          const exportKeys: string[] = []; // list of keys to be exported in excel
          this.fieldObj.customAttributes.columns.forEach((v:any)=> {
            if(v.accessor) {
              customHeaders.push(v.colName);
              exportKeys.push(v.accessor);
            }
          });

          // rows obj keys must follow exportKeys value
          const exportList = this.data.map((obj:any) => {
            const newObj:any = {};
            for (const keyName of exportKeys) {
              newObj[keyName] = obj[keyName]
            }
            return newObj;
          });

          const worksheet = xlsx.utils.json_to_sheet(exportList);
          const workbook = xlsx.utils.book_new();
          xlsx.utils.book_append_sheet(workbook, worksheet, "Data");
          /* replace first row */
          xlsx.utils.sheet_add_aoa(worksheet, [customHeaders], { origin: "A1" });
   
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, this.fieldObj.customAttributes.downloadExcelFileName || 'downloadedExcel');

      });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
  
}
