import {IRequestOptions, request} from '../node_modules/@esri/arcgis-rest-request/src/request';
import { SqlDateFormat, IField, ILayerInfo } from './common';
import UrlFormatError from './UrlFormatError';
import { lrsServer, allLayers } from './urlRe';

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

/**
 * This is to be used for requests that only consist of a URL
 * and does not have any other parameters (besides f=json,
 * which is handled automatically by {@link request}).
 */
export interface IUrlRequestOptions extends IRequestOptions {
  /** The URL of the request. */
  url: string;
}

/**
 * Returns the part of a URL string that matches the given RegExp.
 * @param url URL to be validated
 * @param re Regular expression to be validated against
 * @throws UrlFormatError - Thrown if url doesn't match re.
 * @returns {string} - Returns the portion of the input string that matches the RegExp.
 */
export function validateUrl(url: string, re: RegExp) {
  const match = url.match(re);
  if (match) {
    return match[0];
  }
  throw new UrlFormatError(url, re);
}

/**
 * Validates a URL and then makes a web request using Fetch API.
 * @param requestOptions Request options.
 * @param re RegExp used for validating the URL.
 * @see {@link https://esri.github.io/arcgis-rest-js/api/request/request/|ArcGIS REST JS: request}
 */
export async function makeValidatedRequest(
  requestOptions: IUrlRequestOptions,
  re: RegExp
) {
  let { url } = requestOptions;
  url = validateUrl(url, lrsServer);
  return request(url, requestOptions);
}

/**
 * Gets information about an LRS service
 * @param requestOptions LRS service URL. E.g., https://example.com/MyService/MapServer/exts/LRSServer
 * @see {@link http://roadsandhighwayssample.esri.com/roads/api/lrsserver.html|Linear Referencing Service}
 */
export async function getLrsServiceInfo(
  requestOptions: IUrlRequestOptions
): Promise<ILrsServiceInfo> {
  return makeValidatedRequest(requestOptions, lrsServer);
}

/**
 * Retrieves information about all layers participating in the LRS servive.
 * @param requestOptions
 * @see {@link http://roadsandhighwayssample.esri.com/roads/api/layers.html|All Layers}
 */
export async function getAllLayers(
  requestOptions: IUrlRequestOptions
): Promise<IAllLayersResponse> {
  return makeValidatedRequest(requestOptions, allLayers);
}
