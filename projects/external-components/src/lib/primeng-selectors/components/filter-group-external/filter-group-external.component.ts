import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

export const FilterEventType = {
  DEPENDENT: 'dependent',
  TEXT: 'text',
  DROPDOWN: 'dropdown'
};

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

  initializeCurrentEventConfig() {
    this.currentEventConfig = {};
    this.currentEventConfig[FilterEventType.DEPENDENT] = {
      show: false,
      value: [],
      config: null
    }

    this.currentEventConfig[FilterEventType.TEXT] = {
      show: false,
      value: "",
      config: null
    }

    this.currentEventConfig[FilterEventType.DROPDOWN] = {
      show: false,
      value: "",
      config: null
    }
  }

  initializeDependentValue(length: number) {
    for (let i = 0; i < length; i++) {
      this.currentEventConfig[FilterEventType.DEPENDENT].value[i] = "";
    }
  }

  hideFilterEventPopup() {
    this.currentEventConfig[FilterEventType.DEPENDENT].show = false;
    this.currentEventConfig[FilterEventType.TEXT].show = false;
    this.currentEventConfig[FilterEventType.DROPDOWN].show = false;
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
    this.items = this.fieldObj.customAttributes?.filterOptions?.map((item: any) => {
      item.command = () => {
        this.initializeCurrentEventConfig();
        switch(item.type.toLowerCase()) {
          case FilterEventType.DEPENDENT:
            this.currentEventConfig[FilterEventType.DEPENDENT].show = true;
            this.currentEventConfig[FilterEventType.DEPENDENT].config = item;
            this.initializeDependentValue(item.dependentList.length);
            this.loadDropdownDataFromAPI((item.dependentList && item.dependentList[0]) || []);
            break;
          case FilterEventType.TEXT:
            this.currentEventConfig[FilterEventType.TEXT].show = true;
            this.currentEventConfig[FilterEventType.TEXT].config = item;
            break;
          case FilterEventType.DROPDOWN:
            this.currentEventConfig[FilterEventType.DROPDOWN].show = true;
            this.currentEventConfig[FilterEventType.DROPDOWN].config = item;
            this.loadDropdownDataFromAPI(item);
            break;
        }
        this.showSubMenuOption = true;
      }
      return item;
    }); 
  }

  loadDropdownDataFromAPI(ddOption: any) {
    if (ddOption.optionsConfig && ddOption.optionsConfig.fetch === "ONLOAD") {
      this.loadData(ddOption);
    }
  }

  loadData(ddOption: any) {     
    this.customApiCall(ddOption.optionsConfig).subscribe((data: any) => {
      ddOption.optionList = this.optionsFormatter(data, ddOption.optionsConfig);
    }, ((err: any) => {
      ddOption.optionList = [];
      console.error(err);
    }));
  }

  customGet(object: any, path: any, defaultValue: any) {
    const pathArray = Array.isArray(path) ? path : path.split('.');
    
    for (const key of pathArray) {
      if (object === null || typeof object !== 'object') {
        return defaultValue;
      }
      
      object = object[key];
    }
    
    return object !== undefined ? object : defaultValue;
  }

  optionsFormatter(optionList: any[], optionConfig: any) {
    if(optionList?.length) {

      return optionList.map(optionObj => {
        let modifiedOptionObj = {
          label: this.customGet(optionObj, optionConfig.labelKey, ""),
          value: this.customGet(optionObj, optionConfig.valueKey, "")
        }
        return modifiedOptionObj;
      });
    }
    return [{label:"", value:""}];
  }

  closeSubMenuPopup() {
    this.showSubMenuOption = false;
  }

  changeDependentDropdown(index: number) {
    if (this.currentEventConfig[FilterEventType.DEPENDENT]?.config?.dependentList[index + 1]?.optionsConfig) {
      this.loadData(this.currentEventConfig[FilterEventType.DEPENDENT]?.config?.dependentList[index + 1]);
    }
  }

  applyTextEvent() {
    console.log(this.currentEventConfig[FilterEventType.TEXT]);
    this.closePopup();
  }

  applyDropdownEvent() {
    console.log(this.currentEventConfig[FilterEventType.TEXT]);
    this.closePopup();
  }

  applyDependentEvent() {
    console.log(this.currentEventConfig[FilterEventType.TEXT]);
  }

  ngOnDestroy(): void {
    this.unlistener();
  }
}
