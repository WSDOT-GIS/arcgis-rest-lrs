import { IG2MOutput, IM2GOutput } from "@wsdot/arcgis-rest-lrs";
import { getStartAndEndMeasures } from "@wsdot/crab";
import {
  Point as IRestPoint,
  Polyline as IRestPolyline
} from "arcgis-rest-api";
import geometryJsonUtils = require("esri/geometry/jsonUtils");
import Point = require("esri/geometry/Point");
import Polyline = require("esri/geometry/Polyline");
import Graphic = require("esri/graphic");
import FeatureLayer = require("esri/layers/FeatureLayer");
import SpatialReference = require("esri/SpatialReference");
import TextSymbol = require("esri/symbols/TextSymbol");

export const defaultLrsMapServiceUrl =
  "https://data.wsdot.wa.gov/arcgis/rest/services/CountyRoutes/CRAB_Routes/MapServer";

export const defaultLrsSvcUrl = `${defaultLrsMapServiceUrl}/exts/LRSServer`;
export const defaultLayerId = 0;

/**
 * Converts output from the geometryToMeasure operation into
 * an array of Graphic objects.
 * @param g2mOutput Output from geometryToMeasure operation.
 */
export function* IterateG2MOutputToFeatures(g2mOutput: IG2MOutput) {
  const format = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 3
  });
  const { locations, spatialReference } = g2mOutput;
  const sr = new SpatialReference(spatialReference);
  for (const loc of locations) {
    const { results, status } = loc;
    for (const r of results) {
      const { routeId, measure, geometry, geometryType } = r;
      const attributes = { status, routeId, measure };
      const point = new Point(geometry.x, geometry.y, sr);
      // const symbol = new TextSymbol(`${routeId} @ ${format.format(measure)}`);
      const graphic = new Graphic({ geometry: point, attributes });
      yield graphic;
    }
  }
}

/**
 * Allows user to iterate over features of measureToGeometry output
 * as Graphic objects.
 * @param m2gOutput Output of a measure to geometry operation.
 * @example
 * for (const g of m2gOutputToFeatures(m2gOutput)) {
 *    // do something with the output;
 *    if (!g.geometry) {
 *        console.warn("No geometry", g);
 *    } else {
 *        console.log("Geometry found", g);
 *    }
 * }
 */
export function* m2gOutputToFeatures(m2gOutput: IM2GOutput) {
  const { locations, spatialReference } = m2gOutput;

  const sro = new SpatialReference(spatialReference);

  for (const loc of locations) {
    const { routeId, status } = loc;
    if (!loc.geometry) {
      const attributes = {
        routeId,
        status
      };
      yield new Graphic({ attributes });
    } else if (loc.geometryType === "esriGeometryPoint") {
      const { x, y, m } = loc.geometry as IRestPoint;
      const geometry = new Point(x, y, sro);
      const attributes = {
        routeId,
        status,
        measure: m
      };
      yield new Graphic({ geometry, attributes });
    } else if (loc.geometryType === "esriGeometryPolyline") {
      const { paths, hasM } = loc.geometry as IRestPolyline;
      const geometry = geometryJsonUtils.fromJson(loc.geometry);
      geometry.setSpatialReference(sro);
      const [fromMeasure, toMeasure] = getStartAndEndMeasures(
        loc.geometry as IRestPolyline
      );
      const attributes = {
        routeId,
        status,
        fromMeasure,
        toMeasure
      };
      yield new Graphic({ geometry, attributes });
    }
  }
}
