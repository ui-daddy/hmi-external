export class CustomAttribute {
    name: string;
    value?: any;
    expression?: string;
    accessor?: string;

    constructor(options: {name: string,
        value?: any,
        expression?: string,
        accessor?: string}) {
            this.name = options.name;
            this.value = options.value;
            this.expression = options.expression;
            this.accessor = options.accessor;
        }
}