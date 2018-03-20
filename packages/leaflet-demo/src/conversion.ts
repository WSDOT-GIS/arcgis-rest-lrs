import { Point, Polyline } from "arcgis-rest-api";
import { parseCrabRouteId } from "./CrabRouteId";
import countyLookup from "./CountyLookup";

/**
 * Creates a unique ID for an HTML element, appending a number
 * if the input ID is already in use.
 * @param baseId HTML ID
 */
export function generateId(baseId: string) {
  let id: string = baseId;
  let ok: boolean = false;
  let i: number = 1;
  while (!ok) {
    const element = document.getElementById(id);
    if (!element) {
      ok = true;
    } else {
      id = `${baseId}${i}`;
      i++;
    }
  }
  return id;
}

/**
 * Possible locating status values.
 */
export type EsriLocatingStatus =
  | "esriLocatingOK"
  | "esriLocatingCannotFindRoute"
  | "esriLocatingRouteShapeEmpty"
  | "esriLocatingRouteMeasuresNull"
  | "esriLocatingRouteNotMAware"
  | "esriLocatingCannotFindLocation"
  | "esriLocatingInvalidRouteId"
  | "esriLocatingInvalidMeasure"
  | "esriLocatingNullExtent"
  | "esriLocatingCannotFindExtent"
  | "esriLocatingFromPartialMatch"
  | "esriLocatingToPartialMatch"
  | "esriLocatingFromToPartialMatch"
  | "esriLocatingInvalidLineId"
  | "esriLocatingInvalidLineOrder"
  | "esriLocatingDifferentLineIds";

export interface ILocation {
  status: EsriLocatingStatus;
  routeId: string;
  geometryType: "esriGeometryPoint" | "esriGeometryPolyline";
  geometry: Point | Polyline;
}

/**
 * Converts a measureToGeometry result location into a GeoJSON feature.
 * @param l Location returned from measureToGeometry endpoint
 */
export function convertLocationToGeoJsonFeature(l: ILocation) {
  let g: GeoJSON.GeometryObject | null;
  const properties: any = {
    routeId: l.routeId,
    status: l.status
  };
  switch (l.geometryType) {
    case "esriGeometryPoint":
      const p = l.geometry as Point;
      const gp: GeoJSON.Point = {
        coordinates: [p.x, p.y],
        type: "Point"
      };
      if (p.m != null) {
        properties.measure = p.m;
      }
      g = gp;
      break;
    case "esriGeometryPolyline":
      const pl = l.geometry as Polyline;
      const gls: GeoJSON.MultiLineString = {
        coordinates: pl.paths,
        type: "MultiLineString"
      };
      g = gls;
      break;
    default:
      g = null;
  }
  const feature: GeoJSON.Feature<GeoJSON.GeometryObject | null> = {
    geometry: g,
    properties,
    type: "Feature"
  };
  return feature;
}

function makeDTAndDD(term: string, definition: any) {
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = term;
  dd.textContent = `${definition}`;
  return [dt, dd];
}

/**
 * Creates a <dl> from a GeoJSON Feature's properties.
 * @param feature A GeoJSON Feature
 */
export function geoJsonFeatureToDL(feature: GeoJSON.Feature<any>) {
  const dl = document.createElement("dl");

  if (feature.id) {
    const [dt, dd] = makeDTAndDD("id", feature.id);
    dl.appendChild(dt);
    dl.appendChild(dd);
  }

  if (feature.properties) {
    for (const name in feature.properties) {
      if (feature.properties.hasOwnProperty(name)) {
        const value = feature.properties[name];

        if (name === "routeId") {
          const { countyFipsCode, direction, roadNumber } = parseCrabRouteId(
            value
          );
          const countyName = countyLookup.get(countyFipsCode);
          makeDTAndDD("County", countyName).forEach(h => dl.appendChild(h));
        }

        const [dt, dd] = makeDTAndDD(name, value);
        dl.appendChild(dt);
        dl.appendChild(dd);
      }
    }
  }

  return dl;
}
