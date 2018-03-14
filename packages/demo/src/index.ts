import {
  default as LrsClient,
  IG2MOutputLocation,
  IG2MInputLocation,
  IM2GPointLocation,
  IM2GLineLocation
} from "@wsdot/arcgis-rest-lrs";
import {
  control,
  ControlPosition,
  DivIcon,
  featureGroup as createFeatureGroup,
  GeoJSON as GeoJsonLayer,
  LeafletMouseEvent,
  map as createMap,
  marker as createMarker,
  tileLayer
} from "leaflet";

import GeoJsonExport from "./GeoJsonExport";
import GitHubLink from "./GitHubLink";

// tslint:disable-next-line:no-var-requires
const esriLeaflet = require("esri-leaflet");

import { Point, Polyline } from "arcgis-rest-api";
import GeoJSON, { GeometryObject, GeoJsonObject } from "geojson";
import {
  convertLocationToGeoJsonFeature,
  geoJsonFeatureToDL
} from "./conversion";
import RouteInput, { IRouteSubmitData } from "./RouteInputControl";
import GeometryToMeasureSettings from "./GeometryToMeasureSettings";

const mapServiceUrl =
  "https://data.wsdot.wa.gov/arcgis/rest/services/CountyRoutes/CRAB_Routes/MapServer";
const lrsUrl = `${mapServiceUrl}/exts/LRSServer`;
const layerId = 0;
const client = new LrsClient(lrsUrl);
const routeLayerMinZoom = 15;

// WA extent EPSG:1416 (https://epsg.io/1416-area)
const bounds = new Array<[number, number]>([45.54, -116.91], [49.05, -124.79]);

// Create the map and set extent to WA.
const theMap = createMap("map", {
  preferCanvas: true
}).fitBounds(bounds);

control.scale().addTo(theMap);

// Add basemap layer
const osmLayer = tileLayer("//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    'Map data &copy; <a href="//openstreetmap.org">OpenStreetMap</a> contributors, <a href="//creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  detectRetina: true
}).addTo(theMap);

// Add the county routes layer so the users will know where to click.
const countyRoutesLayer = new esriLeaflet.DynamicMapLayer({
  url: mapServiceUrl,
  minZoom: routeLayerMinZoom,
  // You have to specify "image" here or else it will default to "json".
  f: "image"
});
countyRoutesLayer.addTo(theMap);

interface ICrabPoint
  extends GeoJSON.Feature<
      GeoJSON.Point,
      {
        routeId: string;
        measure: number;
      }
    > {}

// Create a new GeoJSON layer and add the feature collection, then add it to the map.
const geoJsonLayer = new GeoJsonLayer(
  { type: "FeatureCollection", features: [] } as any,
  {
    pointToLayer: (geoJsonPoint: ICrabPoint, latLng) => {
      const formatter = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2
      });
      if (geoJsonPoint.properties) {
        const { routeId, measure } = geoJsonPoint.properties;
        const icon = new DivIcon({
          className: "mp-icon",
          iconSize: [26, 18],
          html: formatter.format(measure)
        });
        const marker = createMarker(latLng, {
          icon
        });
        return marker;
      }
      // Fallback: create default marker.
      return createMarker(latLng);
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(geoJsonFeatureToDL(feature));
    }
  }
);
geoJsonLayer.addTo(theMap);

// Add the layer list control to the map
// This will show base layers and overlays in
// separate sections.
control
  .layers(
    {
      OpenStreetMap: osmLayer
    },
    {
      "County Routes": countyRoutesLayer,
      "Located Events": geoJsonLayer
    }
  )
  .addTo(theMap);

const g2mSettings = new GeometryToMeasureSettings({
  defaultTolerance: 50
});
g2mSettings.addTo(theMap);

// Add the route input control.
const routeInput = new RouteInput();
routeInput.addTo(theMap);

// Add an event listener to the route input form that listens
// for when the user has specified a route + measure.
routeInput.form.addEventListener("route-m-select", async e => {
  const customEvent = e as CustomEvent<IRouteSubmitData>;
  const result = await client.measureToGeometry(
    layerId,
    [customEvent.detail as IM2GPointLocation | IM2GLineLocation],
    undefined,
    4326
  );

  // Convert all result locations containing geometry into GeoJSON features.
  const features = result.locations
    .filter(l => l.geometry)
    .map(convertLocationToGeoJsonFeature);

  // Create a new feature collection and add the features to it.
  const featureCollection: GeoJSON.FeatureCollection<GeometryObject> = {
    features,
    type: "FeatureCollection"
  };

  geoJsonLayer.addData(featureCollection);
});

/**
 * Separates the words that make up an esriLocating... status string
 * and returns a string containing the words separated by spaces (exluding
 * the leading esriLocating portion).
 * If the input string is not in the exected format, the function simple returns the original,
 * unmodified input string.
 * @param locatingStatus The esriLocating... status string (e.g., esriLocatingOK)
 */
function locatingStatusToWords(locatingStatus: string) {
  const re = /[A-Z][a-z]+/g;
  const parts = locatingStatus.replace(/^esriLocating/, "").match(re);
  if (parts) {
    return parts.join(" ");
  }
  return locatingStatus;
}

// Setup map click event to call geometry to measure when user clicks the map.
// If a route location is found nearby, a corresponding marker will be added to the map.
theMap.on("click", async event => {
  const mouseEvent = event as LeafletMouseEvent;
  const { lng, lat } = mouseEvent.latlng;
  const tolerance = g2mSettings.tolerance || undefined;
  const response = await client.geometryToMeasure(
    layerId,
    [[lng, lat]],
    tolerance,
    undefined,
    4326,
    4326
  );
  const { locations, unitsOfMeasure } = response;

  // Get measure unit from label.
  const measureMatch = unitsOfMeasure.match(/^esri(\w+)$/);
  const measureUnit = measureMatch ? measureMatch[1] : "(unknown unit)";

  // Initialize an array for output locations that have no geometry.
  const unlocateable = new Array<IG2MOutputLocation>();

  // Loop through all of the locations...
  for (const l of locations) {
    let hasGeometry = false;
    for (const r of l.results) {
      // Take note if any of the results contain a geometry.
      if (!hasGeometry && r.geometry) {
        hasGeometry = true;
      }
      const { x, y, z, m } = r.geometry;
      const feature = {
        type: "Feature",
        properties: {
          routeId: r.routeId,
          measure: r.measure
        },
        geometry: {
          type: "Point",
          coordinates: [x, y, z]
        }
      };
      geoJsonLayer.addData(feature as GeoJsonObject);
    }
    // If none of the location's results had geometry,
    // add that location to the array of unlocateably
    // results.
    if (!hasGeometry) {
      unlocateable.push(l);
    }
  }

  // If some inputs could not be located, create an error popup
  // and open it at the clicked location.
  if (unlocateable && unlocateable.length > 0) {
    const p = document.createElement("p");
    p.classList.add("github-link");
    p.textContent = "Could not find route location near this location.";
    const list = document.createElement("ol");
    const div = document.createElement("div");
    div.appendChild(p);

    // For each error element, create an <li> and append to
    // document fragment.
    unlocateable
      .map(l => l.status)
      .map(s => {
        const li = document.createElement("li");
        li.textContent = locatingStatusToWords(s);
        return li;
      })
      .forEach(li => list.appendChild(li));
    div.appendChild(list);
    theMap.openPopup(div, mouseEvent.latlng);
  }
});

const position: ControlPosition = "bottomright";
// Add link to source code on GitHub
try {
  // Try to autodetect from page's URL.
  new GitHubLink({
    position
  }).addTo(theMap);
} catch {
  // If running locally (i.e., not hosted on github.io)
  // the source link must be specified and cannot be
  // detected automatically.
  new GitHubLink({
    position,
    userOrOrg: "wsdot-gis",
    repository: "arcgis-rest-lrs-demo"
  }).addTo(theMap);
}

const geoJsonExport = new GeoJsonExport({
  layer: geoJsonLayer
}).addTo(theMap);
