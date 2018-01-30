import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { SqlDateFormat, IField, ILayerInfo } from "./common";

export interface ILrsInfo {
  id: string;
  name: string;
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

export interface IAllLayersResponse {
  networkLayers: ILayerInfo[];
  eventLayers: ILayerInfo[];
  redlineLayers: ILayerInfo[];
  centerlineLayers: ILayerInfo[];
  calibrationPointLayers: ILayerInfo[];
  intersectionLayers: ILayerInfo[];
  nonLRSLayers: ILayerInfo[];
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

function isValidLrsServiceUrl(url: string) {
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
  url = isValidLrsServiceUrl(url);
  return request(url, requestOptions);
}
