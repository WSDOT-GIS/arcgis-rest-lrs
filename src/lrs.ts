import * as urlRe from "./urlRe";
import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { SqlDateFormat, IField, ILayerInfo } from "./common";
import { INetworkLayer } from "./layers";

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

export interface INetworkLayersResponse {
  networkLayers: INetworkLayer[];
}

export interface ILrsServerRequestOptions extends IRequestOptions {
  url: string;
}

export function isValidLrsServiceUrl(url: string) {
  const match = url.match(urlRe.lrsServer);
  if (match) {
    return match[0];
  }
  throw new Error(`URL must match ${urlRe.lrsServer}.`);
}

/**
 * Gets information about an LRS service
 * @param requestOptions LRS service URL. E.g., https://example.com/MyService/MapServer/exts/LRSServer
 */
export async function getLrsServiceInfo(
  requestOptions: ILrsServerRequestOptions
): Promise<ILrsServiceInfo> {
  let { url } = requestOptions;
  url = isValidLrsServiceUrl(url);
  return request(url, requestOptions);
}

class LrsServiceUrlBuilder {
  private _url: string;
  public get url(): string {
    return this._url;
  }
  public set url(url: string) {
    if (!url) {
      throw new TypeError("url not provided");
    }
    this._url = isValidLrsServiceUrl(url);
  }

  public get networkLayersUrl(): string {
    return `${this.url}/networkLayers`;
  }

  /**
   *
   */
  constructor(url: string) {
    this.url = url;
  }

  public getNetworkLayerUrl(layerId: number): string {
    return `${this.networkLayersUrl}/${layerId}`;
  }
}
