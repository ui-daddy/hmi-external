import { CustomAttribute } from "./custom-attribute";

export class PrimeNgDropdown {
    inputId: string = "";
    optionLabel: string = "";
    optionValue: string = "";
    dataKey: string = "";
    autoDisplayFirst: boolean = false;
    optionList: Array<any> = [];
    scrollHeight: string = "200px";

    constructor(customAttributes: any) {
        if (customAttributes !== undefined && customAttributes !== null) {
            for (let i = 0; i < customAttributes.length; i++) {
                if (customAttributes[i].name && customAttributes[i].value !== undefined) {
                    this.initializeAttributeValue(customAttributes[i])
                }     
            }
        }
    }

    initializeAttributeValue(customAttribute: CustomAttribute) {
        switch(customAttribute.name) {
            case "inputId":
                this.inputId = customAttribute.value;
                break;
            case "optionLabel":
                this.optionLabel = customAttribute.value;
                break;
            case "optionValue":
                this.optionValue = customAttribute.value;
                break;
            case "dataKey":
                this.dataKey = customAttribute.value;
                break;
            case "autoDisplayFirst":
                this.autoDisplayFirst = customAttribute.value;
                break;
            case "optionList":
                this.optionList = customAttribute.value;
                break;
            case "scrollHeight":
                this.scrollHeight = customAttribute.value;
                break;           
        }
    }
}