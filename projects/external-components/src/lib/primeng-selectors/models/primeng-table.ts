export class PrimeNgTable {
    caption: string = "";
    summary: string = "";
    colNameAccessorMap: any;
    dataConfig: any;
    loading: boolean = false; // To load data
    dataKey: string = "";
    rowHover: boolean = true;
    rows: number = 3;
    showCurrentPageReport: boolean = true;
    rowsPerPageOptions: Array<number> = [];
    paginator: boolean = true;
    currentPageReportTemplate: string = "Showing {first} to {last} of {totalRecords} entries";
    filterDelay: number = 0;

    constructor(customAttributes: any) {
        if (customAttributes !== undefined && customAttributes !== null) {
            for (let i = 0; i < customAttributes.length; i++) {
                if (customAttributes[i].name && customAttributes[i].value !== undefined) {
                    this.initializeAttributeValue(customAttributes[i])
                }     
            }
        }
    }

    initializeAttributeValue(customAttribute: any) {
        switch(customAttribute.name) {
            case "caption":
                this.caption = customAttribute.value;
                break;
            case "summary":
                this.summary = customAttribute.value;
                break;
            case "colNameAccessorMap":
                this.colNameAccessorMap = customAttribute.value;
                break;
            case "dataConfig":
                this.dataConfig = customAttribute.value;
                break;
            case "dataKey":
                this.dataKey = customAttribute.value;
                break;
            case "rowHover":
                this.rowHover = customAttribute.value;
                break;
            case "rows":
                this.rows = customAttribute.value;
                break;
            case "showCurrentPageReport":
                this.showCurrentPageReport = customAttribute.value;
                break;
             case "rowsPerPageOptions":
                this.rowsPerPageOptions = customAttribute.value;
                break;
            case "paginator":
                this.paginator = customAttribute.value;
                break;
            case "currentPageReportTemplate":
                this.currentPageReportTemplate = customAttribute.value;
                break;
            case "filterDelay":
                this.filterDelay = customAttribute.value;
                break;
        }
    }
}