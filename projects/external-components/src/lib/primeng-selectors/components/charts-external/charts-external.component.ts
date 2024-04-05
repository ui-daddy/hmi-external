import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'hmi-ext-charts-external',
  templateUrl: './charts-external.component.html',
  styleUrls: ['./charts-external.component.css']
})
export class ChartsExternalComponent extends CommonExternalComponent implements OnInit, OnDestroy {

  //PrimeNg charts supports chart.js v2.9.4. v3 of charts will be supported soon maybe next version
  data: any;
  options: any;
  type: any;
  loading: boolean = false;
  dataBuild: any;
  height:any;

  constructor() {
    super();      
  }

  ngOnInit(): void {   
    this.options = this.fieldObj.customAttributes.options;
    this.type = this.fieldObj.customAttributes.type;
    if (this.fieldObj.customAttributes.height === null || this.fieldObj.customAttributes.height === undefined || this.fieldObj.customAttributes.height === "") {
      this.height = "100vh";     
    } else {
      this.height = this.fieldObj.customAttributes.height;
    }
    if (this.fieldObj.customAttributes.dataConfig) {
      this.loadData();     
    } else {
      this.data = this.fieldObj.customAttributes.data;
    }
    this.subscription = this.fieldObj.action.subscribe((actionObj: any) => {
      if (actionObj.actionType === "RELOAD_COMPONENT_DATA") {
        this.loadData();
      };
      if (actionObj.actionType === "setfield") {
        let result= actionObj.data;
        this.dataFormation(result)

      }      
    });
  }

  loadData(): void {
    this.loading = true;
    if (this.fieldObj.customAttributes.dataConfig && this.fieldObj.customAttributes.dataConfig.url) {
      this.customApiCall(this.fieldObj.customAttributes.dataConfig).subscribe((data: any) => {
        
        let result = data;
        this.dataFormation(result)

      });
    }
  }

  private resultsToChartMapper(resultDataObj: any): Object {
    let chartDataObj: any = {},
    resultArrayDataMapping = this.fieldObj.customAttributes.resultArrayDataMapping;
    resultArrayDataMapping.forEach( (resultDataMapConfig: any) => {
      chartDataObj[resultDataMapConfig.chartConfigKey] = resultDataObj[resultDataMapConfig.resultDataKey];
    });
    return chartDataObj;
  }

  dataFormation(result:any){
      let dataToChartMap: any = {};
  this.dataBuild  = {
    labels: [],
    datasets: []
  };
  if (this.fieldObj.customAttributes.dataToChartMapping && this.fieldObj.customAttributes.dataToChartMapping.length) {
    for(let mappingObj of this.fieldObj.customAttributes.dataToChartMapping) {
      dataToChartMap[mappingObj.chartConfigKey] = mappingObj.resultDataKey;            
    }
    let singleDataSet: {label: string, backgroundColor: string, data: Array<number>} = {
      label: "Shippment Carriers",
      backgroundColor: "#42A5F5",
      data: []
    };
    for (let resultDataObj of result) {
      singleDataSet.data.push(parseInt(resultDataObj[dataToChartMap.data]));
      this.dataBuild.labels.push(resultDataObj[dataToChartMap.labels]);              
    }
    if (this.fieldObj.customAttributes.backgroundColor && this.fieldObj.customAttributes.backgroundColor.length) {
      singleDataSet.backgroundColor = this.fieldObj.customAttributes.backgroundColor;
    }    
    if (this.fieldObj.customAttributes.label) {
      singleDataSet.label = this.fieldObj.customAttributes.label;
    }         
    this.dataBuild.datasets.push(singleDataSet);
    //this.data.dataSet = result.map(this.resultsToChartMapper, this);
  } else {
    this.dataBuild.datasets = result;
    this.dataBuild.labels = this.fieldObj.customAttributes.labels;
  }
  this.data = this.dataBuild;
  this.loading = false;

  }


  /** Data format
   * this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'My First dataset',
              backgroundColor: '#42A5F5',
              data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
              label: 'My Second dataset',
              backgroundColor: '#FFA726',
              data: [28, 48, 40, 19, 86, 27, 90]
          }
      ]
    }

    this.options = {
      title: {
          display: true,
          text: 'Line chart Demo',
          fontSize: 16
      },
      legend: {
          position: 'bottom'
      }
    };

    this.type = "bar";
  **/

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }

}
