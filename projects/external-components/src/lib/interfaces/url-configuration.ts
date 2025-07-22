import { HMIAction } from "./hmi-events";

export enum HTTPMethod {
    GET="GET", POST="POST", PUT="PUT", DELETE="DELETE", PATCH="PATCH"
}

export interface UrlParameterConfig {
    paramName: string; //Name which will send to server. It also supports accessor, ex - user.fullName
    mappedField: string; //Input field Name from where value will be extracted. Also supports MappedFieldConstant.
    mappedValue?: string; //Accessor of mappedField value, ex - user.fullName. If empty, mappedField will be used.
    valueFormat?: string; //Format input field value. Ex. $DATE(DDMMYYY), $TIME(HH:mm), $SHARED_DATA(value.option)
}

export interface SharedDataConfiguration {
    varName: string;
    responseAccessor?: string;
    cache?: boolean;
    staticData?: any;
}

export interface FieldDataConfiguration {
    id: string;
    responseAccessor?: string;
    staticValue?: any
}

export interface SuccessConfiguration {
    pageUrl?: string;
    sharedData?: Array<SharedDataConfiguration>;
    fieldData?: Array<FieldDataConfiguration>;
    clearSharedData?: Array<string>;
    deleteTableRow?: boolean;
    showSuccessMessage?: boolean;
    actions?: Array<HMIAction>;
    apiDataAccessor?: string;
    message?: string
}

export interface ErrorConfiguration {
    pageUrl?: string;
    sharedData?: Array<SharedDataConfiguration>;
    fieldData?: Array<FieldDataConfiguration>;
    clearSharedData?: Array<string>;
    showErrorMessage?: boolean;
    actions?: Array<HMIAction>;
    message?: string;
    apiDataAccessor?: string;
}

export interface ConfirmModalData {
    type: string;
    condition: string;
    message: {
      title: string,
      body: string
    };
    yesButtonLabel: string;
    noButtonLabel: string;
  }

export interface BeforeSubmitFormat {
    action: Array<ConfirmModalData>
}

export interface UrlConfiguration {
    name?: string;
    url: string;
    method: string;
    pathParams?: Array<UrlParameterConfig>;
    queryParams?: Array<UrlParameterConfig>;
    payloadParams?: Array<UrlParameterConfig>;
    fetch?: string;
    onSuccess?: SuccessConfiguration;
    onError?: ErrorConfiguration;
    beforeSubmit?: BeforeSubmitFormat;
    downloadFileName?: string;
    responseType?: string;
    encodePathAndQueryParams?: boolean;
    isWithCredentials?: any;
}