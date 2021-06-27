import { PrimeNgField } from "./primeng-field";

export class PrimeNgTable extends PrimeNgField {
    caption: string = "";
    summary: string = "";
    colNameAccessorMap: any;
    dataConfig: any;
    loading: boolean = false; // To load data
    dataKey: string = "";
    rowHover: boolean = true;
    rows: number = 10;
    showCurrentPageReport: boolean = true;
    rowsPerPageOptions: Array<number> = [];
    paginator: boolean = true;
    currentPageReportTemplate: string = "";
    filterDelay: number = 0;
    globalFilterFields: Array<string> = [];
    autoLayout: boolean = true;
    resizableColumns: boolean = true;
    reorderableColumns: boolean = true;
    responsive: boolean = true;

    constructor(customAttributes: any) {
        super();
        this.initAttributes(customAttributes);
    }
}