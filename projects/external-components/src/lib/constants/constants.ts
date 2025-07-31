export const JsonType = {
  BODY: 'body',
  HEADER: 'header',
  NAV: 'nav',
  FOOTER: 'footer',
  HOME: 'home',
  FIELD: 'field',
  SECTION: 'section',
  DATA: 'data',
  HEADERFIELD: 'headerField',
  HEADERSECTION: 'headerSection',
  HEADERDATA: 'headerData',
  NAVFIELD: 'navField',
  NAVSECTION: 'navSection',
  NAVDATA: 'navData',
  FOOTERFIELD: 'footerField',
  FOOTERSECTION: 'footerSection',
  FOOTERDATA: 'footerData',
};

export const EventType = {
  ONCLICK: 'ONCLICK', //5ed93bbddfdb32357c2b1d17
  ONLOAD: 'ONLOAD',
  ONEXPRESSIONCHANGE: 'ONEXPRESSIONCHANGE',
};

export const MappedFieldConstant = {
  CUSTOM_FIELD_OBJECT: 'CUSTOM_FIELD_OBJECT',
  SEARCH_TEXT: 'SEARCH_TEXT',
  $URL_PATH_PARAMS: '$URL_PATH_PARAMS',
  $URL_QUERY_PARAMS: '$URL_QUERY_PARAMS',
};

export const ValueFormatConstant = {
  $DATETIME: '$DATETIME',
  $DATE: '$DATE',
  $TIME: '$TIME',
  $NUMBER: '$NUMBER',
  $CHECKBOX: '$CHECKBOX',
  $SHARED_DATA: '$SHARED_DATA',
};

export const FieldValidationStatus = {
  $DIRTY: '$DIRTY',
  $TOUCHED: '$TOUCHED',
  $PRISTINE: '$PRISTINE',
};

export const StyleTagId = {
  body: 'body-custom-style',
  page: 'page-custom-style',
};

export type TOOLTIP_PLACEMENT = 'top' | 'end' | 'bottom' | 'start' | 'right';
