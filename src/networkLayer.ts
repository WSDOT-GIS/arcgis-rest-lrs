import * as urlRe from "./urlRe";

import { INetworkLayer } from "./layers";
import { IUrlRequestOptions, makeValidatedRequest } from './lrs';
import { Point, SpatialReference, Geometry, Polyline } from 'arcgis-rest-api';
import { esriLocatingStatusG2M, MeasureUnits, esriLocatingStatusM2G, dateToTimeInstant } from './common';

export interface INetworkLayersResponse {
  networkLayers: INetworkLayer[];
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
    geometry: Point | Polyline;
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
  options.locations = options.locations.map(coordsToLocation);
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
