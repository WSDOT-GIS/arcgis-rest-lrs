import { getLrsServiceInfo } from "../src/lrs";

import { LrsInfo } from "./mocks/responses";

import * as fetchMock from "fetch-mock";

import "isomorphic-fetch";
import "isomorphic-form-data";

describe("lrs", () => {
  afterEach(fetchMock.restore);
  it("should be able to get LRS service information", async done => {
    fetchMock.once("*", LrsInfo);

    const lrsUrl =
      "http://roadsandhighwayssample.esri.com/arcgis/rest/services/RoadsHighways/NewYork/MapServer/exts/LRSServer";
    try {
      const response = await getLrsServiceInfo({ url: lrsUrl });
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
});
