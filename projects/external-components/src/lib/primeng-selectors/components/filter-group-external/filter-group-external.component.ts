import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

export const FilterEventType = {
  DEPENDENT: 'dependent',
  TEXT: 'text',
  DROPDOWN: 'dropdown'
};

export interface IFilterGroup {
  filterName: any;
  label: string;
  type: string;
  value: string;
  show: boolean;
  labelKey?: string;
  valueKey?: string;
  isArrayOfString?: boolean;
  filterApplied?: boolean;
  optionList?: any[];
  filterGroup?: IFilterGroup[];
  pillLabel: string;
  showLoader: boolean;
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
  filterLoader: boolean;

  constructor(private renderer2: Renderer2) { 
    super();
    this.showPopup = false;
    this.showSubMenuOption = false;
    this.items = [];
    this.filterLoader = false;
  }

  filterFormGrp : IFilterGroup[] = [];
  appliedFilterPills: IFilterGroup[] = [];
  initializeFilterFormGrp() {
    this.filterFormGrp = this.fieldObj.customAttributes?.filterOptions?.map((v: any)=> {
      v.filterGroup.map((item:any)=>{
        if(item.isArrayOfString === true){
          item.labelKey = "label";
          item.valueKey = "value"
        }
      })
      const data = { ...v, show: false };
      if (v.type === FilterEventType.DEPENDENT) {
        const filterGroup = v.filterGroup.map((dep:any)=> ({ ...dep, value: '' }))
        return {...data, filterGroup}
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

  restoreValue() {
    if (this.appliedFilterPills.length > 0) {
      this.filterFormGrp = JSON.parse(JSON.stringify(this.appliedFilterPills));
    }
  }

  ngOnInit() {
    this.initializeFilterFormGrp();

    this.subscription = this.fieldObj.action.subscribe((actionObj: any) => {
      if (actionObj.actionType === "CLEAR_COMPONENT_DATA") {
        this.filterFormGrp.forEach((filter: IFilterGroup) => {
          filter.filterApplied = false;
        })
        this.updateFilterPill();
      } else if (actionObj.actionType === "RELOAD_COMPONENT_DATA") {
        this.applyFilter();
      }
      if (actionObj.actionType === "SHOW_COMPONENT_LOADER") {
        this.filterLoader = true;
      }
      if (actionObj.actionType === "HIDE_COMPONENT_LOADER") {
        this.filterLoader = false;
      }
    });

    this.items = this.fieldObj.customAttributes?.filterOptions?.map((item: any, index:number) => {
      item.command = () => {
        this.restoreValue();
        this.hideFilterFormGrp();
        const filterObj = this.filterFormGrp[index];
        switch(item.type.toLowerCase()) {
          case FilterEventType.DEPENDENT:
            filterObj.show = true;
            if(filterObj.filterGroup && filterObj.filterGroup.length) {
              this.loadDropdownDataFromAPI((filterObj.filterGroup[0]) || []);
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
    ddOption.showLoader = true;
    this.customApiCall(ddOption.optionsConfig).subscribe((data: any[]) => {
      if(ddOption.isArrayOfString === true){
        ddOption.optionList = data.map(item => ({ [ddOption.labelKey]: item, [ddOption.valueKey]: item })); //tranformimg array of strings to array of objects
      }else{
        ddOption.optionList = data;
      }      if (data && data.length && ddOption.filterOptionListBy) {
        ddOption.optionList = ddOption.optionList.filter((v:any)=> v[ddOption.filterOptionListBy] === selectedValue);
      }
      ddOption.showLoader = false;
    }, ((err: any) => {
      ddOption.optionList = [];
      console.error(err);
      ddOption.showLoader = false;
    }));
  }

  closeSubMenuPopup() {
    this.showSubMenuOption = false;
  }

  changeDependentDropdown(index: number, selectedValue: any,list: any[]) {
    if (list[index + 1]?.optionsConfig) {
      this.clearOtherDependentDropdown(list, index + 2);
      this.loadData(list[index + 1], selectedValue);
    }
  }

  removeDependentDropdown(index: number, selectedValue: any,list: any[], event: any) {
    event.stopPropagation();
    if (list[index + 1]?.optionsConfig) {
      list[index].value= null;
      this.clearOtherDependentDropdown(list, index + 1);
    }
  }

  clearOtherDependentDropdown(list: any[], index: number) {
    for (; index < list.length; index++) {
      list[index].optionList = [];
    }
  }

  updateFilterPill() {
    this.appliedFilterPills = JSON.parse(JSON.stringify(this.filterFormGrp));
  }

  getFilterPillValue(filter: IFilterGroup): IFilterGroup {
    filter.pillLabel = "";
    if (filter.type === FilterEventType.DEPENDENT) {
      filter.filterGroup?.forEach(((depF: IFilterGroup) => {
        if (depF.value) {
          filter.pillLabel += depF.label + ": " + depF.value + ", ";
        }
      }));
      if (filter.pillLabel.length >=2 && filter.pillLabel[filter.pillLabel.length - 2] === ",") {
        filter.pillLabel = filter.pillLabel.slice(0, filter.pillLabel.length - 2);
      }
    } else {
      filter.pillLabel += filter.label + ": " + filter.value;
    }
    return filter;
  }

  applyTextEvent(filterObj: IFilterGroup) {
    filterObj.filterApplied = true;
    this.closePopup();
    this.applyFilter();
  }

  applyDropdownEvent(filterObj: IFilterGroup) {
    filterObj.filterApplied = true;
    this.closePopup();
    this.applyFilter();
  }

  applyDependentEvent(filterObj: IFilterGroup) {
    filterObj.filterApplied = true;
    this.closePopup();
    this.applyFilter();
  }

  prepareData(): any[] {
    let data: any = {};
    this.filterFormGrp.forEach((filter: IFilterGroup) => {
      if(filter.filterApplied) {
        if (filter.type === 'dependent') {
          filter.filterGroup?.forEach(((depF: IFilterGroup) => {
            if (depF.filterName) {
              data[depF.filterName] = depF.value;
            }
          }));
        } else {
          if (filter.filterName) {
            data[filter.filterName] = filter.value;
          }
        }
      }
    });
    return data;
  }

  applyFilter(isRemove?: boolean, filter?: IFilterGroup) {
    this.filterLoader = true;
    const data = this.prepareData(),
          config = JSON.parse(JSON.stringify(this.fieldObj.customAttributes?.filterConfig));
    config.queryParams = this.filterParams(config.queryParams, data);
    config.pathParams = this.filterParams(config.pathParams, data);
    config.payloadParams = this.filterParams(config.payloadParams, data);

    if (this.fieldObj.customAttributes?.showComponentLoaderOnApply) {
      this.initializeEvents.emit({ name: "fireEvent", events: [
        {
          "event": "click",
          "actions": [{
            "actionType": "SHOW_COMPONENT_LOADER",
            "componentName": this.fieldObj.customAttributes?.showComponentLoaderOnApply
          }]
        }
      ], data: null});
    }
    
    this.customApiCall(config, data).subscribe((data: any[]) => {
      if (isRemove && filter) {
        filter.filterApplied = false;
        if (filter.type === FilterEventType.DEPENDENT) {
          filter.filterGroup?.map((fObj) => { fObj.value = ''});
        } else {
          filter.value = '';
        }
      }
      this.updateFilterPill();
      this.hideComponentLoader();
    }, ((err: any) => {
      console.error(err);
      this.hideComponentLoader();
    }));
  }

  hideComponentLoader() {
    this.filterLoader = false;
    if (this.fieldObj.customAttributes?.showComponentLoaderOnApply) {
      this.initializeEvents.emit({ name: "fireEvent", events: [
        {
          "event": "click",
          "actions": [{
            "actionType": "HIDE_COMPONENT_LOADER",
            "componentName": this.fieldObj.customAttributes?.showComponentLoaderOnApply
          }]
        }
      ], data: null});
    }
  }

  filterParams(params: any, data: any): any[] {
    return params?.length ? params.filter((param: any) => !!data[param.mappedValue]) : [];
  }

  removeFilter(filter: IFilterGroup, index: number) {
    this.filterFormGrp[index].filterApplied = false;
    this.applyFilter(true, this.filterFormGrp[index]);
  }

  ngOnDestroy(): void {
    if (this.unlistener) {
      this.unlistener();
    }
  }
}
