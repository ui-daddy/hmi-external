import { UrlConfiguration } from "./url-configuration";

export interface MetaTag {
    name?: string;
    content?: string;
    httpEquiv?: string;
    charset?: string;
}

export interface InterceptorConfiguration {
    statusCode: string;
    type?: string;
    messageCode?: string;
    msgResponseAccessor?: string;
    messageCodeResponseAccessor?: string;
    message?: string;
    pageUrl?: string;
    clearSharedData?: Array<string>;
}
export interface LinkTag {
    crossOrigin?: string;
    href?: string;
    hreflang?: string;
    media?: string;
    referrerPolicy?: string;
    rel: string;
    sizes?: string;
    title?: string;
    type?: string;
}

export interface CssConfiguration {
    selectorName?: string;
    xs?: any;
    sm?: any;
    md?: any;
    lg?: any;
}

export interface LayoutCss {
    customClassName?: string;
    configuration?: Array<CssConfiguration>;
    themeClass?: string;
}

export class LayoutProperties {
    width?: number;
    height?: number;
    labelPlacement = "top";
    css: LayoutCss;
    orientation: string;
}

export class PageLayoutProperties {
  css: LayoutCss;
}

export interface AppConfigurationProperties {
    title?: string; // If page title layoutProperties not defined then App level properties will be applied
    baseUrl?: string;
    metaTags?: Array<MetaTag>;
    linkTags?: Array<LinkTag>;
    layoutProperties?: LayoutProperties; // If page level layoutProperties not defined then App level properties will be applied
    ifPageNotFound?: string;
    apiConfigurations?: Array<UrlConfiguration>;
    interceptorConfigurations?: Array<InterceptorConfiguration>;
}

export interface IField {
    baseProperties: IBaseProperties,
    layoutProperties: ILayoutPoperties,
    expressionProperties: IExpressionProperties,
    events: any[],
    customAttributes: ICustomAttributes
}

export interface IBaseProperties {
    id: string,
    type: string,
    name: string,
    formName: string,
    label: string,
    inputType: string,
    library: string
}

export interface ILayoutPoperties {
    orientation: string,
    labelPlacement: string,
    css: any
}

export interface IExpressionProperties {
    requiredValue: string,
    required: string,
    visibleValue: string,
    visible: string,
    readOnlyValue: string,
    readOnly: string,
    disabledValue: string,
    disabled: string
}
export class SectionFieldData {
    widgetList: IFieldWidget[] = [];
    hiddenBaseProperties: string[] = [];
    hiddenLayoutProperties: string[] = [];
    hiddenExpressionProperties: string[] = [];
    customAttributes: ICustomAttributes[] = [];
}
export interface ICustomAttributes {
    propertyName: string,
    defaultValueMapping: string,
    type: 'text' | 'number' | 'dropdown' | 'textarea' | 'checkbox'  | 'multi-select',
    label: string,
    subtype?: 'custom',
    placeholder?: string
}
export interface GlobalPageSetting {
  title: string;
  layoutProperties?: PageLayoutProperties;
}

export interface ConditionConfiguration {
  if: string;
  onConditionSuccess: string;
  type?: string;
  cookieName?: string;
}
export interface AuthGuardConfiguration {
  enabled: boolean;
  conditions?: Array<ConditionConfiguration>;
}
export interface pageData{
  fetchFromLocal: boolean,
  localURL: string,
  serverURL?: Array<UrlConfiguration>;
}

export interface PageSettings {
  globalPageSettings: GlobalPageSetting,
  authGuardConfig: AuthGuardConfiguration,
  data: pageData
};

interface IFieldWidget {
    name: string;
    icon: string;
    label: string;
    section?: string;
}
