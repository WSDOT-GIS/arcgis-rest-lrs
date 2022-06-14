import * as urlRe from "./urlRe";
import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import {
  SqlDateFormat,
  IField,
  ILayerInfo,
  MeasureUnits,
  esriLocatingStatusG2M,
  dateToTimeInstant,
  esriLocatingStatusM2G,
} from "./common";
import { INetworkLayer } from "./layers";
import UrlFormatError from "./UrlFormatError";
import { SpatialReference, Point, Geometry, Polyline } from "arcgis-rest-api";

/** LRS Version */
export interface ILrsVersion {
  name: string;
  description: string;
  access:
    | "esriVersionAccessPublic"
    | "esriVersionAccessProtected"
    | "esriVersionAccessPrivate";
  parentVersion: string | null;
}

/** LRS Info */
export interface ILrsInfo {
  id: string;
  name: string;
  description?: string;
  versions?: ILrsVersion[];
}

/** Redline Info */
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

/** Response from the All Layers endpoint */
export interface IAllLayersResponse {
  networkLayers: ILayerInfo[];
  eventLayers: ILayerInfo[];
  redlineLayers: ILayerInfo[];
  centerlineLayers: ILayerInfo[];
  calibrationPointLayers: ILayerInfo[];
  intersectionLayers: ILayerInfo[];
  nonLRSLayers: ILayerInfo[];
}

/** Response from the LRSService endpoint */
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

/** Response format of the networkLayers endpoint */
export interface INetworkLayersResponse {
  networkLayers: INetworkLayer[];
}

/**
 * This is to be used for requests that only consist of a URL
 * and does not have any other parameters (besides f=json,
 * which is handled automatically by {@link request}).
 */
export interface IEndpointRequestOptions extends IRequestOptions {
  /** The URL of the request. */
  endpoint: string;
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
  requestOptions: IEndpointRequestOptions,
  re: RegExp
) {
  let { endpoint } = requestOptions;
  endpoint = validateUrl(endpoint, re);
  delete (requestOptions as any).endpoint;
  return request(endpoint, requestOptions);
}

/**
 * Gets information about an LRS service
 * @param requestOptions LRS service URL. E.g., https://example.com/MyService/MapServer/exts/LRSServer
 * @see {@link http://roadsandhighwayssample.esri.com/roads/api/lrsserver.html|Linear Referencing Service}
 */
export async function getLrsServiceInfo(
  requestOptions: IEndpointRequestOptions
): Promise<ILrsServiceInfo> {
  return makeValidatedRequest(requestOptions, urlRe.lrsServer);
}

/**
 * Retrieves information about all layers participating in the LRS servive.
 * @param requestOptions
 * @see {@link http://roadsandhighwayssample.esri.com/roads/api/layers.html|All Layers}
 */
export async function getAllLayers(
  requestOptions: IEndpointRequestOptions
): Promise<IAllLayersResponse> {
  return makeValidatedRequest(requestOptions, urlRe.allLayers);
}

/**
 * Fetches information about the network layers.
 * @param requestOptions
 * @see {@link http://roadsandhighwayssample.esri.com/roads/api/networklayer.html|Network Layer}
 */
export async function getNetworkLayers(
  requestOptions: IEndpointRequestOptions
): Promise<INetworkLayersResponse> {
  return makeValidatedRequest(requestOptions, urlRe.networkLayers);
}

/**
 * Describes an input location with geometry
 */
export interface IG2MInputLocation {
  routeId?: string | null;
  geometry: Point;
}

/**
 * Output format of locations returned by geometryToMeasure endpoint
 */
export interface IG2MOutputLocation {
  status: esriLocatingStatusG2M;
  results: Array<{
    routeId: string;
    measure: number;
    geometryType: "esriGeometryPoint";
    geometry: Point;
  }>;
}

/**
 * Output format returned by geometryToMeasure endpoint
 */
export interface IG2MOutput {
  unitsOfMeasure: MeasureUnits;
  spatialReference: SpatialReference;
  locations: IG2MOutputLocation[];
}

/**
 * Input parameters for geometryToMeasure operation.
 */
export interface IG2MOptions extends IEndpointRequestOptions {
  locations: Array<IG2MInputLocation | number[]>;
  tolerance?: number;
  temporalViewDate?: Date;
  inSR?: number;
  outSR?: number;
  gdbVersion?: string;
}

/**
 * Common properties of a location returned by measureToGeometry operation
 */
export interface IM2GLocation {
  routeId: string;
}

/** Point location returned by measureToGeometry */
export interface IM2GPointLocation extends IM2GLocation {
  measure: number;
}

/** Polyline location returned by measureToGeometry */
export interface IM2GLineLocation extends IM2GLocation {
  toRouteId?: string;
  fromMeasure: number;
  toMeasure: number;
}

/**
 * Input parameters for measureToGeometry operation.
 */
export interface IM2GOptions extends IEndpointRequestOptions {
  locations: IM2GLocation[];
  temporalViewDate: Date;
  outSR?: number;
  gdbVersion?: string;
}

/**
 * Output format of response returned from the measureToGeometry operation.
 */
export interface IM2GOutput {
  /**
   * Spatial reference of the locations' geometry coordinates.
   */
  spatialReference: SpatialReference;
  locations: Array<{
    status: esriLocatingStatusM2G;
    routeId: string;
    geometryType: "esriGeometryPoint" | "esriGeometryPolyline";
    geometry: Point | Polyline;
  }>;
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
        y: location[1],
      },
    };
  }
  return location;
}

/**
 * Client for LRS Services.
 */
export class LrsClient {
  // tslint:disable-next-line:variable-name
  private _url: string;
  /**
   * Gets the "url" property.
   */
  public get url(): string {
    return this._url;
  }

  /**
   * Creates a new instance of the client class.
   * @param url The URL of the LRS service.
   * @example
   * http://roadsandhighwayssample.esri.com/arcgis/rest/services/RoadsHighways/NewYork/MapServer/exts/LRSServer
   */
  constructor(url: string) {
    this._url = validateUrl(url, urlRe.lrsServer);
  }

  /**
   * Finds route measures nearest to the input locations.
   * @param layerId Layer ID integer
   * @param locations An array of objects or number arrays.
   * @param tolerance Distance around input locations to search for a route
   * @param temporalViewDate View date
   * @param inSR Spatial reference corresponding to locations parameter.
   * @param outSR Specifies the spatial reference of the output
   * @param gdbVersion GDB Version
   */
  public async geometryToMeasure(
    layerId: number,
    locations: Array<IG2MInputLocation | number[]>,
    tolerance?: number,
    temporalViewDate?: Date,
    inSR?: number | SpatialReference,
    outSR?: number | SpatialReference,
    gdbVersion?: string
  ) {
    const requestUrl = `${this.url}/networkLayers/${layerId}/geometryToMeasure`;

    const params: any = {
      locations: locations.map(coordsToLocation),
    };

    if (tolerance !== undefined) {
      params.tolerance = tolerance;
    }
    if (temporalViewDate) {
      params.temporalViewDate = temporalViewDate.getTime();
    }
    if (inSR) {
      params.inSR = inSR;
    }
    if (outSR) {
      params.outSR = outSR;
    }
    if (gdbVersion) {
      params.gdbVersion = gdbVersion;
    }

    return (await request(requestUrl, { params })) as IG2MOutput;
  }

  /**
   * Returns the geometry for the input measures.
   * @param layerId Layer identifier integer
   * @param locations Objects defining measures along a route
   * @param temporalViewDate View date
   * @param outSR Spatial reference for the output geometry
   * @param gdbVersion Geodatabase Version
   */
  public async measureToGeometry(
    layerId: number,
    locations: Array<IM2GPointLocation | IM2GLineLocation>,
    temporalViewDate?: Date,
    outSR?: number | SpatialReference,
    gdbVersion?: string
  ) {
    const requestUrl = `${this.url}/networkLayers/${layerId}/measureToGeometry`;

    const params: any = {
      layerId,
      locations,
    };

    if (temporalViewDate) {
      params.temporalViewDate = temporalViewDate.getTime();
    }

    if (outSR) {
      params.outSR = outSR;
    }

    if (gdbVersion) {
      params.gdbVersion = gdbVersion;
    }

    return (await request(requestUrl, { params })) as IM2GOutput;
  }
}
