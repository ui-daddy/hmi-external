import { PrimeNgField } from "./primeng-field";

export class PrimeNgPassword extends PrimeNgField {
    mediumRegex: string = "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,}).";
    strongRegex: string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})";
    weakLabel: string = "";
    mediumLabel: string = "";
    strongLabel: string = "";
    feedback: boolean = true;
    toggleMask: boolean = false;
    appendTo: string = "";
    inputStyle: any = null;
    inputStyleClass: string = "";
    inputId: string = "";
    style: string = "";
    styleClass: string = "";
    placeholder: string = "";

    constructor(customAttributes: any) {
        super();
        this.initAttributes(customAttributes);
    }
}