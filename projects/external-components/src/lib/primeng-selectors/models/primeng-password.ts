export class PrimeNgPassword {
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
            case "mediumRegex":
                this.mediumRegex = customAttribute.value;
                break;
            case "strongRegex":
                this.strongRegex = customAttribute.value;
                break;
            case "weakLabel":
                this.weakLabel = customAttribute.value;
                break;
            case "mediumLabel":
                this.mediumLabel = customAttribute.value;
                break;
            case "strongLabel":
                this.strongLabel = customAttribute.value;
                break;
            case "feedback":
                this.feedback = customAttribute.value;
                break;
            case "toggleMask":
                this.toggleMask = customAttribute.value;
                break;
            case "appendTo":
                this.appendTo = customAttribute.value;
                break;
            case "inputStyle":
                this.inputStyle = customAttribute.value;
                break;
            case "inputStyleClass":
                this.inputStyleClass = customAttribute.value;
                break;
            case "inputId":
                this.inputId = customAttribute.value;
                break;
            case "style":
                this.style = customAttribute.value;
                break;
            case "styleClass":
                this.styleClass = customAttribute.value;
                break;
            case "placeholder":
                this.placeholder = customAttribute.value;
                break;
        }
    }
}