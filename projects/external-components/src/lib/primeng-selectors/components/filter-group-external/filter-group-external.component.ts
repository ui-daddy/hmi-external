import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

export const FilterEventType = {
  DEPENDENT: 'dependent',
  TEXT: 'text',
  DROPDOWN: 'dropdown'
};

export interface IFilterGroup {
  label: string;
  type: string;
  value: string;
  show: boolean;
  labelKey?: string;
  valueKey?: string;
  filterApplied?: boolean;
  optionList?: any[];
  dependentList?: IFilterGroup[];
}

@Component({
  selector: 'hmi-ext-filter-group',
  templateUrl: './filter-group-external.component.html',
  styleUrls: ['./filter-group-external.component.scss']
})
export class FilterGroupExternalComponent extends CommonExternalComponent implements OnDestroy {
  showPopup: boolean;
  items: any[];
  private unlistener: any;
  showSubMenuOption: boolean;
  currentEventConfig: any;

  constructor(private renderer2: Renderer2) { 
    super();
    this.showPopup = false;
    this.showSubMenuOption = false;
    this.items = [];
  }

  filterFormGrp : IFilterGroup[] = [];
  initializeFilterFormGrp() {
    this.filterFormGrp = this.fieldObj.customAttributes?.filterOptions?.map((v: any)=> {
      const data = { ...v, show: false };
      if (v.type === FilterEventType.DEPENDENT) {
        const dependentList = v.dependentList.map((dep:any)=> ({ ...dep, value: '' }))
        return {...data, dependentList}
      }
      return data;
    });
    console.info('filterFormGrp ',this.filterFormGrp)
  }

  hideFilterFormGrp() {
    this.filterFormGrp = this.filterFormGrp.map(v=> ({...v, show: false}))
  }

  handleShowPopup() {
    this.showPopup = true;
    this.unlistener = this.renderer2.listen("document", "click", event => {
        if (!(event.target.id === ("filter-menu-popup-" + this.fieldObj.baseProperties?.id) 
          || event.target.closest("#filter-menu-popup-" + this.fieldObj.baseProperties?.id)
          || event.target.id === ("filter-group-btn-" + this.fieldObj.baseProperties?.id) 
          || event.target.closest("#filter-group-btn-" + this.fieldObj.baseProperties?.id)
          || event.target.id === ("filter-menu-subpopup-" + this.fieldObj.baseProperties?.id) 
          || event.target.closest("#filter-menu-subpopup-" + this.fieldObj.baseProperties?.id))) {
            this.closePopup();
        }
    });
  }

  closePopup() {
    this.showPopup = false;
    this.showSubMenuOption = false;
    this.unlistener();
  }

  ngOnInit() {
    console.log(this.fieldObj);
    this.initializeFilterFormGrp();
    this.items = this.fieldObj.customAttributes?.filterOptions?.map((item: any, index:number) => {
      item.command = () => {
        this.hideFilterFormGrp();
        const filterObj = this.filterFormGrp[index];
        switch(item.type.toLowerCase()) {
          case FilterEventType.DEPENDENT:            
            filterObj.show = true;
            if(filterObj.dependentList && filterObj.dependentList.length) {
              this.loadDropdownDataFromAPI((filterObj.dependentList[0]) || []);
            }
            break;
          case FilterEventType.TEXT:
            filterObj.show = true;
            break;
          case FilterEventType.DROPDOWN:
            filterObj.show = true;
            this.loadDropdownDataFromAPI(item);
            break;
        }
        this.showSubMenuOption = true;
        console.info('filterFormGrp ',this.filterFormGrp)
      }
      return item;
    }); 
  }

  loadDropdownDataFromAPI(ddOption: any) {
    if (ddOption.optionsConfig && ddOption.optionsConfig.fetch === "ONLOAD") {
      this.loadData(ddOption);
    }
  }

  loadData(ddOption: any, selectedValue?: string) {     
    this.customApiCall(ddOption.optionsConfig).subscribe((data: any[]) => {
      ddOption.optionList = data;
      if (data && data.length && ddOption.filterOptionListBy) {
        ddOption.optionList = ddOption.optionList.filter((v:any)=> v[ddOption.filterOptionListBy] === selectedValue)
      }
    }, ((err: any) => {
      ddOption.optionList = [];
      console.error(err);
    }));
  }

  closeSubMenuPopup() {
    this.showSubMenuOption = false;
  }

  changeDependentDropdown(index: number, selectedValue: any,list: any[]) {
    if (list[index + 1]?.optionsConfig) {
      this.loadData(list[index + 1], selectedValue);
    }
  }

  applyTextEvent(filterObj: any) {
    filterObj.filterApplied = true;
    this.closePopup();
  }

  applyDropdownEvent(filterObj: any) {
    filterObj.filterApplied = true;
    this.closePopup();
  }

  applyDependentEvent(filterObj: any) {
    filterObj.filterApplied = true;
    this.closePopup();
  }

  ngOnDestroy(): void {
    this.unlistener();
  }
}
