/// <reference types="jasmine" />

import {
  LrsClient,
  getLrsServiceInfo,
  IM2GOutput,
  IM2GLocation,
  IM2GPointLocation,
  IM2GLineLocation,
  IG2MOutput,
} from "../src/lrs";

import { LrsInfo, G2MResponse, M2GResponse } from "./mocks/responses";
import * as wsdotResponses from "./mocks/wsdot/responses";

// import fetchMock from "fetch-mock";
import { request } from "@esri/arcgis-rest-request";
import { ISpatialReferenceInfo } from "../src/common";
import { SpatialReferenceWkid, Point, Polyline } from "arcgis-rest-api";

const guidRe = /[a-f\d\-]+/i;

describe("lrs", () => {
  // afterEach(fetchMock.restore);
  describe("WSDOT service", () => {
    const mapServiceUrl =
      "https://data.wsdot.wa.gov/arcgis/rest/services/CountyRoutes/CRAB_Routes/MapServer";
    const lrsUrl = `${mapServiceUrl}/exts/LRServer`;
    it("should be able to get LRS service information", async () => {
      // fetchMock.once("*", wsdotResponses.lrsServiceInfo);
      const svcInfo = await getLrsServiceInfo({ endpoint: lrsUrl });
      expect(svcInfo.currentVersion).toBeGreaterThanOrEqual(10.51);
      expect(svcInfo.networkLayers).toBeDefined();
      expect(svcInfo.networkLayers.length).toBeGreaterThan(0);

      // Test the layer
      (() => {
        const layer = svcInfo.networkLayers[0];
        expect(layer.id).toEqual(0);
        expect(layer.name).toMatch("CRAB_Routes");
        expect(layer.type).toMatch("esriLRSNetworkLayer");
      })();

      // Check LRS objects
      for (const lrs of svcInfo.lrs) {
        expect(lrs.id).toMatch(guidRe);
        expect(lrs.name).toBeTruthy();
        expect(lrs.description).toBeDefined();
        for (const v of lrs.versions!) {
          expect(v.name).toBeTruthy();
          expect(v.description).toBeDefined();
          expect(v.access).toMatch(/^esriVersionAccess\w+$/);
          expect(v.parentVersion).toBeDefined();
        }
      }

      const fieldNameRe = /^[\w\.\(\)]+$/;
      // Check Redline Infos for expected properties.
      for (const rli of svcInfo.redlineInfos!) {
        expect(rli.featureClassName).toMatch(/\w+\.\w+\.\w+/);
        expect(typeof rli.isDataVersioned).toMatch("boolean");
        expect(rli.versionName).toBeDefined();
        expect(rli.dateFormat).toMatch(/^esriLRSDateFormat\w+$/);
        expect(rli.routeIdFieldName).toMatch(fieldNameRe);
        expect(rli.routeNameFieldName).toMatch(fieldNameRe);
        expect(rli.fromMeasureFieldName).toMatch(fieldNameRe);
        expect(rli.toMeasureFieldName).toMatch(fieldNameRe);
        expect(rli.effectiveDateFieldName).toMatch(fieldNameRe);
        expect(rli.activityTypeFieldName).toMatch(fieldNameRe);
        expect(rli.networkFieldName).toMatch(fieldNameRe);
        expect(rli.lrs.id).toMatch(guidRe);
        expect(rli.lrs.name).toBeTruthy();

        for (const field of rli.fields) {
          expect(field.name).toMatch(fieldNameRe);
          expect(field.type).toMatch(/^esriFieldType\w+$/);
          expect(field.alias).toBeDefined();
          expect(typeof field.editable).toMatch("boolean");
          expect(typeof field.nullable).toMatch("boolean");
          if (field.type !== "esriFieldTypeGeometry") {
            expect(field.defaultValue).toBeDefined(
              `Expected field.defaultValue to be defined.\n${JSON.stringify(
                field
              )}`
            );
          }
          expect(field.domain).toBeDefined();
          if (field.domain) {
            expect(field.domain.type).toBeTruthy();
            expect(field.domain.name).toBeTruthy();
            expect(field.domain.codedValues.length).toBeGreaterThan(0);
          }
        }
      }
    });

    describe("location functions", () => {
      const layerId = 0;
      const coords = [-122.76984840631485, 47.95474190515651];
      const inSR = 4326;
      const tolerance = 50;
      const routeId = "5303151600i";
      const measure = 1.4010354979252355;
      const temporalViewDate = new Date(2018, 2, 6);
      it("should be able perform geometry to measure", async () => {
        // fetchMock.once("*", wsdotResponses.g2mResponse);
        const client = new LrsClient(lrsUrl);
        const response = await client.geometryToMeasure(
          layerId,
          [coords],
          tolerance,
          temporalViewDate,
          inSR
        );

        expect(Array.isArray(response.locations)).toEqual(
          true,
          "locations property should be an array."
        );
        expect(response.spatialReference).toBeDefined();
        expect(
          (response.spatialReference as SpatialReferenceWkid).wkid
        ).toBeTruthy();
        expect(response.unitsOfMeasure).toMatch(
          /^esri(Feet|Meters|Kilometers|Miles)$/
        );
        for (const loc of response.locations) {
          expect(loc.status).toMatch(/^esriLocating\w+/);
          if (loc.status.match(/esriLocatingOK/)) {
            for (const result of loc.results) {
              expect(result.geometry).toBeDefined();
              expect(result.geometryType).toMatch(/^esriGeometryPoint$/);
              expect(typeof result.measure).toEqual("number");
              expect(typeof result.routeId).toEqual("string");
            }
          }
        }
      });

      it("should be able to perform measure to geometry", async () => {
        // fetchMock.once("*", wsdotResponses.m2gResponse);
        const locations = [{ routeId, fromMeasure: 0, toMeasure: 1 }];
        const client = new LrsClient(lrsUrl);
        const expectedWkid = 2927;

        const response = await client.measureToGeometry(
          layerId,
          locations,
          temporalViewDate
        );
        expect(
          (response.spatialReference as SpatialReferenceWkid).wkid
        ).toEqual(expectedWkid);
        for (const location of response.locations) {
          expect(location.geometryType).toMatch(
            /^esriGeometry(Point|Polyline)$/,
            "Expected geometry type to be either Point or Polyline"
          );
          switch (location.geometryType) {
            case "esriGeometryPoint":
              const p = location.geometry as Point;
              expect(p.x).toBeDefined();
              expect(p.y).toBeDefined();
              break;
            case "esriGeometryPolyline":
              const pl = location.geometry as Polyline;
              expect(Array.isArray(pl.paths)).toEqual(true);
              break;
          }
        }
      });
    });
  });

  // This Esri sample service doesn't seem to exist anymore.
  // describe("Esri sample service", () => {
  //   const mapServiceUrl =
  //     "http://roadsandhighwayssample.esri.com/arcgis/rest/services/RoadsHighways/NewYork/MapServer";
  //   const lrsUrl = `${mapServiceUrl}/exts/LRSServer`;
  //   // afterEach(fetchMock.restore);
  //   it("should be able to get LRS service information", async () => {
  //     // fetchMock.once("*", LrsInfo);


  //     const response = await getLrsServiceInfo({ endpoint: lrsUrl });
  //     // expect(fetchMock.called()).toEqual(true);
  //     // const [url, options]: [string, any] = fetchMock.lastCall("*");
  //     // const { method, body } = options;
  //     // expect(method).toBe("POST");
  //     // expect(body).toContain("f=json");
  //     expect(response.currentVersion).toBeGreaterThanOrEqual(10.4);
  //     expect(response.capabilities).toBeDefined();
  //     const {
  //       networkLayers,
  //       eventLayers,
  //       redlineLayers,
  //       centerlineLayers,
  //       calibrationPointLayers,
  //       intersectionLayers,
  //       nonLRSLayers,
  //     } = response;
  //     for (const la of [
  //       networkLayers,
  //       eventLayers,
  //       redlineLayers,
  //       centerlineLayers,
  //       calibrationPointLayers,
  //       intersectionLayers,
  //       nonLRSLayers,
  //     ]) {
  //       expect(Array.isArray(la)).toEqual(
  //         true,
  //         "*Layers property should be an array."
  //       );
  //       for (const { id, name, type } of la) {
  //         expect(id).toBeGreaterThanOrEqual(0);
  //         expect(typeof name).toBe("string");
  //         expect(type).toMatch(/^esri(\w+)Layer$/);
  //       }
  //     }

  //     for (const { id, name, description, versions } of response.lrs) {
  //       expect(id).toMatch(/[a-z0-9\-]/i);
  //       [id, name, description].forEach((s) => {
  //         expect(typeof s).toBe("string");
  //       });
  //       [id, name].forEach((s) => {
  //         expect(typeof s).toBeTruthy();
  //       });
  //       expect(versions).toBeTruthy();
  //       if (versions) {
  //         versions.forEach((v) => {
  //           [v.name, v.description, v.access].forEach((s) => {
  //             expect(s).toBeTruthy();
  //           });
  //           expect(v.parentVersion).toBeDefined();
  //         });
  //       }
  //     }

  //   });
  //   it("should be able to locate points from geometry", async () => {
  //     // fetchMock.once("*", G2MResponse);
  //     const locations = [[-74.08758044242859, 40.60800676691363]];
  //     const inSR = 4326;
  //     const tolerance = 50;

  //     const layerId = 2;

  //     const client = new LrsClient(lrsUrl);

  //     const response = await client.geometryToMeasure(
  //       layerId,
  //       locations,
  //       tolerance
  //     );
  //     expect(response).toBeTruthy();
  //     expect(response.unitsOfMeasure).toMatch(/^esriMiles$/);
  //     expect(response.spatialReference).toBeDefined();
  //     // expect((response.spatialReference as SpatialReferenceWkid).wkid).toEqual(inSR);
  //     expect(response.locations).toBeDefined();
  //     expect(response.locations.length).toBeGreaterThan(0);

  //     for (const loc of response.locations) {
  //       expect(loc.status).toMatch(/^esriLocating\w+$/);
  //       for (const result of loc.results) {
  //         expect(result.routeId).toBeDefined();
  //         expect(result.measure).toBeDefined();
  //         expect(result.geometryType).toMatch(/^esriGeometryPoint$/);
  //         expect(result.geometry).toBeDefined();
  //         expect(result.geometry.x).toBeDefined();
  //         expect(result.geometry.y).toBeDefined();
  //       }
  //     }
  //   });
  //   it("should be able to locate points from measures", async () => {
  //     // fetchMock.once("*", M2GResponse);
  //     const locations: Array<IM2GPointLocation | IM2GLineLocation> = [
  //       { routeId: "10023601", measure: 6.5318821878293 },
  //       { routeId: "10023601", fromMeasure: 0, toMeasure: 6 },
  //     ];
  //     const layerId = 2;

  //     const client = new LrsClient(lrsUrl);
  //     const response = await client.measureToGeometry(layerId, locations);

  //     expect(response.locations).toBeDefined();
  //     expect(response.spatialReference).toBeDefined();
  //     expect(response.locations.length).toEqual(2);

  //     response.locations.forEach((loc, i) => {
  //       const inputLoc = locations[i];
  //       expect(loc.routeId).toMatch(
  //         inputLoc.routeId,
  //         "Input route ID should match output."
  //       );
  //       if ("fromMeasure" in inputLoc) {
  //         expect(loc.geometryType).toMatch("esriGeometryPolyline");
  //         const polyline = loc.geometry as Polyline;
  //         expect(polyline.paths).toBeDefined();
  //       } else if ("measure" in inputLoc) {
  //         expect(loc.geometryType).toMatch("esriGeometryPoint");
  //         const point = loc.geometry as Point;
  //         expect(point.x).toBeDefined();
  //         expect(point.y).toBeDefined();
  //       } else {
  //         fail(`invalid geometry type: ${loc.geometryType}`);
  //       }
  //     });
  //   });
  // });
});
