export class PrimeNgField {
    constructor() { }

    initAttributes(customAttributes: any) {
        if (customAttributes && Object.keys(customAttributes).length) {
            Object.assign(this, customAttributes);
        }
    }
}