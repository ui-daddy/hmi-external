import { PrimeNgField } from "./primeng-field";

export class PrimeNgText extends PrimeNgField {
    disabled: boolean = false;

    constructor(customAttributes: any) {
        super();
        this.initAttributes(customAttributes);
    }
}