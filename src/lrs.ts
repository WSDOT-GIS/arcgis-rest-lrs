import * as urlRe from "./urlRe";
import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import {
  SqlDateFormat,
  IField,
  ILayerInfo,
  MeasureUnits,
  esriLocatingStatusG2M,
  dateToTimeInstant,
  esriLocatingStatusM2G
} from "./common";
import { INetworkLayer } from "./layers";
import UrlFormatError from "./UrlFormatError";
import { SpatialReference, Point, Geometry } from "arcgis-rest-api";

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
async function makeValidatedRequest(
  requestOptions: IUrlRequestOptions,
  re: RegExp
) {
  let { url } = requestOptions;
  url = validateUrl(url, re);
  delete requestOptions.url;
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
  return makeValidatedRequest(requestOptions, urlRe.lrsServer);
}

/**
 * Retrieves information about all layers participating in the LRS servive.
 * @param requestOptions
 * @see {@link http://roadsandhighwayssample.esri.com/roads/api/layers.html|All Layers}
 */
export async function getAllLayers(
  requestOptions: IUrlRequestOptions
): Promise<IAllLayersResponse> {
  return makeValidatedRequest(requestOptions, urlRe.allLayers);
}

/**
 * Fetches information about the network layers.
 * @param requestOptions
 * @see {@link http://roadsandhighwayssample.esri.com/roads/api/networklayer.html|Network Layer}
 */
export async function getNetworkLayers(
  requestOptions: IUrlRequestOptions
): Promise<INetworkLayersResponse> {
  return makeValidatedRequest(requestOptions, urlRe.networkLayers);
}

export interface IG2MInputLocation {
  routeId?: string | null;
  geometry: Point;
}

export interface IG2MOutputLocation {
  status: esriLocatingStatusG2M;
  results: Array<{
    routeId: string;
    measure: number;
    geometryType: "esriGeometryPoint";
    geometry: Point;
  }>;
}

export interface IG2MOutput {
  unitsOfMeasure: MeasureUnits;
  spatialReference: SpatialReference;
  locations: IG2MOutputLocation[];
}

export interface IG2MOptions extends IUrlRequestOptions {
  locations: Array<IG2MInputLocation | number[]>;
  tolerance?: number;
  temporalViewDate?: Date;
  inSR?: number;
  outSR?: number;
  gdbVersion?: string;
}

export interface IG2MLocation {
  routeId: string;
}

export interface IG2MPointLocation extends IG2MLocation {
  routeId: string;
  measure: number;
}

export interface IG2MLineLocation extends IG2MLocation {
  routeId: string;
  toRouteId?: string;
  fromMeasure: number;
  toMeasure: number;
}

export interface IM2GOptions extends IUrlRequestOptions {
  locations: IG2MLocation[];
  temporalViewDate: Date;
  outSR?: number;
  gdbVersion?: string;
}

/**
 * Converts an array of two numbers to an input location object for
 * use with the REST API. If the input is already in the expected format,
 * it will be returned as-is.
 * @param location
 * @example
 * const locations = numbers.map(coordsToLocation);
 * @throws TypeError if the input is an array with less than two elements.
 */
function coordsToLocation(location: IG2MInputLocation | number[]) {
  if (Array.isArray(location)) {
    if (location.length < 2) {
      throw TypeError("Item must be an array with two or more elements.");
    }
    return {
      geometry: {
        x: location[0],
        y: location[1]
      }
    };
  }
  return location;
}

export interface IM2GOutput {
  spatialReference: SpatialReference;
  locations: Array<{
    status: esriLocatingStatusM2G;
    routeId: string;
    geometryType: "esriGeometryPoint" | "esriGeometryPolyline";
    geometry: Geometry;
  }>;
}

/**
 * Finds route measures closest to the input points.
 * @param options
 * @see {@link http://roadsandhighwayssample.esri.com/roads/api/geometrytomeasure.html|Geometry to Measure (Operation)}
 */
export async function geometryToMeasure(
  options: IG2MOptions
): Promise<IG2MOutput> {
  // make sure double[] are converted to location objects.
  options.locations = JSON.stringify(options.locations.map(coordsToLocation)) as any;
  if (options.temporalViewDate) {
    options.temporalViewDate = dateToTimeInstant(
      options.temporalViewDate
    ) as any;
  }
  return makeValidatedRequest(options, urlRe.geometryToMeasure);
}

/**
 * Returns the geometries for the input route measures.
 * @param options
 * @see {@link http://roadsandhighwayssample.esri.com/roads/api/measuretogeometry.html|Measure to Geometry (Operation)}
 */
export async function measureToGeometry(
  options: IM2GOptions
): Promise<IM2GOutput> {
  if (options.temporalViewDate) {
    options.temporalViewDate = dateToTimeInstant(
      options.temporalViewDate
    ) as any;
  }
  return makeValidatedRequest(options, urlRe.measureToGeometry);
}
