import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
export interface FieldDynamicAttributes {
    id: string;
    name: string;   //can be removed if we start using id everywhere
    required: string;
    requiredValue: boolean;
    readonly: string;
    readOnlyValue: boolean;
    disabled: string;
    disabledValue: boolean;
    visible: string;
    visibleValue: boolean;
    minDate: string;
    minDateValue: NgbDateStruct;
    maxDate: string;
    maxDateValue: NgbDateStruct;
    value: any;
    
    //Non-core attributes
    modified: boolean;
    isValueModified: boolean;
    isValueOverride: boolean;
}
