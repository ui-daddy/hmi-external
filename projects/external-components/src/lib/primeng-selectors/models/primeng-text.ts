export class PrimeNgText {
    disabled: boolean = false;

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
       if (customAttribute.name === "disabled") {
           this.disabled = customAttribute.value;
       }
   }
}