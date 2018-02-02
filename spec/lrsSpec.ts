import LrsClient, {
  getLrsServiceInfo,
  IM2GOutput,
  IM2GLocation,
  IM2GPointLocation,
  IM2GLineLocation,
  IG2MOutput
} from "../src/lrs";

import { LrsInfo, G2MResponse, M2GResponse } from "./mocks/responses";

import * as fetchMock from "fetch-mock";

import "isomorphic-fetch";
import "isomorphic-form-data";
import { request } from "@esri/arcgis-rest-request";
import { ISpatialReferenceInfo } from "../src/common";
import { SpatialReferenceWkid, Point, Polyline } from "arcgis-rest-api";

const mapServiceUrl =
  "http://roadsandhighwayssample.esri.com/arcgis/rest/services/RoadsHighways/NewYork/MapServer";
const lrsUrl = `${mapServiceUrl}/exts/LRSServer`;

describe("lrs", () => {
  afterEach(fetchMock.restore);
  it("should be able to get LRS service information", async done => {
    fetchMock.once("*", LrsInfo);

    try {
      const response = await getLrsServiceInfo({ endpoint: lrsUrl });
      expect(fetchMock.called()).toEqual(true);
      const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
      const { method, body } = options;
      expect(method).toBe("POST");
      expect(body).toContain("f=json");
      expect(response.currentVersion).toBeGreaterThanOrEqual(10.4);
      expect(response.capabilities).toBeDefined();
      const {
        networkLayers,
        eventLayers,
        redlineLayers,
        centerlineLayers,
        calibrationPointLayers,
        intersectionLayers,
        nonLRSLayers
      } = response;
      for (const la of [
        networkLayers,
        eventLayers,
        redlineLayers,
        centerlineLayers,
        calibrationPointLayers,
        intersectionLayers,
        nonLRSLayers
      ]) {
        expect(Array.isArray(la)).toEqual(
          true,
          "*Layers property should be an array."
        );
        for (const { id, name, type } of la) {
          expect(id).toBeGreaterThanOrEqual(0);
          expect(typeof name).toBe("string");
          expect(type).toMatch(/^esri(\w+)Layer$/);
        }
      }

      for (const { id, name, description, versions } of response.lrs) {
        expect(id).toMatch(/[a-z0-9\-]/i);
        [id, name, description].forEach(s => {
          expect(typeof s).toBe("string");
        });
        [id, name].forEach(s => {
          expect(typeof s).toBeTruthy();
        });
        if (!versions) {
          done.fail("Versions should not be undefined.");
        } else {
          versions.forEach(v => {
            [v.name, v.description, v.access].forEach(s => {
              expect(s).toBeTruthy();
            });
            expect(v.parentVersion).toBeDefined();
          });
        }
      }
      done();
    } catch (ex) {
      done.fail(ex);
    }
  });
  it("should be able to locate points from geometry", async done => {
    fetchMock.once("*", G2MResponse);
    const locations = [[-74.08758044242859, 40.60800676691363]];
    const inSR = 4326;
    const tolerance = 50;

    const layerId = 2;

    const client = new LrsClient(lrsUrl);
    let response: IG2MOutput;
    try {
      response = await client.geometryToMeasure(layerId, locations, tolerance);
    } catch (e) {
      done.fail(e);
    }

    if (response) {
      expect(response).toBeTruthy();
      expect(response.unitsOfMeasure).toMatch(/^esriMiles$/);
      expect(response.spatialReference).toBeDefined();
      // expect((response.spatialReference as SpatialReferenceWkid).wkid).toEqual(inSR);
      expect(response.locations).toBeDefined();
      expect(response.locations.length).toBeGreaterThan(0);

      for (const loc of response.locations) {
        expect(loc.status).toMatch(/^esriLocating\w+$/);
        for (const result of loc.results) {
          expect(result.routeId).toBeDefined();
          expect(result.measure).toBeDefined();
          expect(result.geometryType).toMatch(/^esriGeometryPoint$/);
          expect(result.geometry).toBeDefined();
          expect(result.geometry.x).toBeDefined();
          expect(result.geometry.y).toBeDefined();
        }
      }
    }

    done();
  });
  it("should be able to locate points from measures", async done => {
    fetchMock.once("*", M2GResponse);
    const locations: Array<IM2GPointLocation | IM2GLineLocation> = [
      { routeId: "10023601", measure: 6.5318821878293 },
      { routeId: "10023601", fromMeasure: 0, toMeasure: 6 }
    ];
    const layerId = 2;

    const client = new LrsClient(lrsUrl);
    try {
      const response = await client.measureToGeometry(layerId, locations);

      expect(response.locations).toBeDefined();
      expect(response.spatialReference).toBeDefined();
      expect(response.locations.length).toEqual(2);

      response.locations.forEach((loc, i) => {
        const inputLoc = locations[i];
        expect(loc.routeId).toMatch(
          inputLoc.routeId,
          "Input route ID should match output."
        );
        if ("fromMeasure" in inputLoc) {
          expect(loc.geometryType).toMatch("esriGeometryPolyline");
          const polyline = loc.geometry as Polyline;
          expect(polyline.paths).toBeDefined();
        } else if ("measure" in inputLoc) {
          expect(loc.geometryType).toMatch("esriGeometryPoint");
          const point = loc.geometry as Point;
          expect(point.x).toBeDefined();
          expect(point.y).toBeDefined();
        } else {
          fail(`invalid geometry type: ${loc.geometryType}`);
        }
      });
    } catch (ex) {
      done.fail(ex);
    }

    done();
  });
});
