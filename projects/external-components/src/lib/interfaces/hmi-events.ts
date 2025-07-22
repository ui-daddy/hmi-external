import { SharedDataConfiguration, UrlConfiguration } from "./url-configuration";

export const VALID_EVENTS = ["click", "blur", "change", "focus", "select", "submit", "reset", "keydown", "keypress", "keyup", "mouseover",
    "mouseout", "mousedown", "mouseup", "mousemove", "load", "unload", "resize", "error"];

export interface HMIEvent {
    event: string,
    actions : Array<HMIAction>,
    debounce?: number
}

export enum ACTION_TYPE {
    MESSAGE = 'message',
    NAVIGATE = 'navigate',
    OPNE_URL= 'openurl',
    SET_FIELD= 'setfield',
    CLEAR_COMPONENT_DATA = 'CLEAR_COMPONENT_DATA',
    RELOAD_COMPONENT_DATA = 'RELOAD_COMPONENT_DATA',
    INVOKE_API= 'INVOKE_API',
    OPEN_MODAL= 'OPEN_MODAL',
    CLOSE_MODAL= 'CLOSE_MODAL',
    WAIT_IN_MS= 'WAIT_IN_MS',
    SET_SHARED_DATA= 'SET_SHARED_DATA',
    DOWNLOAD_FILE_FROM_URL = "DOWNLOAD_FILE_FROM_URL",
    DOWNLOAD_FILE_URI= 'DOWNLOAD_FILE_URI',
    SHOW_COMPONENT_LOADER= 'SHOW_COMPONENT_LOADER',
    HIDE_COMPONENT_LOADER= 'HIDE_COMPONENT_LOADER'
}

export interface HMIAction {
    actionType: string;
    condition?: string;
    fileName: string;
    field: string;
    fieldValue: string;
    fieldAccessor: string;
    messagetype?: string;
    messageText?: string;
    apiConfig?: UrlConfiguration;
    url?: string;
    target?: string;
    sharedData?: Array<SharedDataConfiguration>;
    timer?: number;
    formName?: string;
    componentName?: string;
}