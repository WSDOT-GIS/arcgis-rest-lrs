import { request, IRequestOptions } from "@esri/arcgis-rest-request";

export interface ILayerInfo {
  id: number;
  name: string;
  type: string; // TODO: create custom type with possibility string values.
}

export interface ILrsVersion {
  name: string;
  description: string;
  access:
    | "esriVersionAccessPublic"
    | "esriVersionAccessProtected"
    | "esriVersionAccessPrivate";
  parentVersion: string | null;
}

export interface ILrsInfo {
  id: string;
  name: string;
  description: string;
  versions?: ILrsVersion[];
}

export type SqlDateFormat =
  | "esriLRSDateFormatStandard"
  | "esriLRSDateFormatFileGDB"
  | "esriLRSDateFormatOracle";

export interface IFieldDomain {
  type: string; // e.g., "codedValue",
  name: string;
  codedValues: Array<{ name: string; code: string | number }>;
}

export interface IField {
  name: string;
  type: string; // "<fieldType1>",
  alias: string;
  length: number;
  editable: boolean;
  nullable: boolean;
  defaultValue: any;
  domain: IFieldDomain;
}

export interface IRedlineInfo {
  featureClassName: string; // the backing feature class name
  isDataVersioned: boolean;
  versionName: string;
  dateFormat: SqlDateFormat;
  routeIdFieldName: string;
  routeNameFieldName: string;
  fromMeasureFieldName: string;
  toMeasureFieldName: string;
  effectiveDateFieldName: string;
  activityTypeFieldName: string;
  networkFieldName: string;
  lrs: {
    id: string;
    name: string;
  };
  fields: IField[];
}

export interface ILrsServiceInfo {
  currentVersion: number;
  capabilities: string;
  networkLayers: ILayerInfo[];
  eventLayers: ILayerInfo[];
  redlineLayers: ILayerInfo[];
  centerlineLayers: ILayerInfo[];
  calibrationPointLayers: ILayerInfo[];
  intersectionLayers: ILayerInfo[];
  nonLRSLayers: ILayerInfo[];
  lrs: ILrsInfo[];
  redlineInfos?: IRedlineInfo[];
}

export interface ILrsServerRequestOptions extends IRequestOptions {
  url: string;
}

function checkUrl(url: string) {
  const re = /^(https?:\/\/.+\/MapServer\/exts\/LRSServer\b)/;
  const match = url.match(re);
  if (match) {
    return match[0];
  }
  throw new Error(`URL must match ${re}.`);
}

export function getLrsServiceInfo(
  requestOptions: ILrsServerRequestOptions
): Promise<ILrsServiceInfo> {
  let { url } = requestOptions;
  url = checkUrl(url);
  return request(url, requestOptions);
}
