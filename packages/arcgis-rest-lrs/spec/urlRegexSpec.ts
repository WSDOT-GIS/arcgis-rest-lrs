import * as urlRe from "../src/urlRe";
import { validateUrl } from "../src/lrs";
import UrlFormatError from "../src/UrlFormatError";

// Define URLs that will be tested. Note that only format is tested, so the URLs do not need to be a real ones.
const urls: { [key: string]: string } = {};
urls.lrsServer =
  "http://roadsandhighwayssample.esri.com/arcgis/rest/services/RoadsHighways/NewYorkRoads/MapServer/exts/LRSServer";
urls.allLayers = `${urls.lrsServer}/layers`;
urls.applyEdits = `${urls.lrsServer}/applyEdits`;
urls.createVersion = `${urls.lrsServer}/createVersion`;
urls.deleteVersion = `${urls.lrsServer}/deleteVersion`;
urls.reconcileVersion = `${urls.lrsServer}/reconcileVersion`;

urls.networkLayers = `${urls.lrsServer}/networkLayers`;
urls.networkLayer = `${urls.networkLayers}/0`;
urls.geometryToMeasure = `${urls.networkLayer}/geometryToMeasure`;
urls.measureToGeometry = `${urls.networkLayer}/measureToGeometry`;
urls.translate = `${urls.networkLayer}/translate`;
urls.concurrencies = `${urls.networkLayer}/concurrencies`;
urls.queryAttributeSet = `${urls.networkLayer}/queryAttributeSet`;
urls.checkEvents = `${urls.networkLayer}/checkEvents`;

urls.eventLayers = `${urls.lrsServer}/eventLayers`;
urls.eventLayer = `${urls.eventLayers}/0`;
urls.geometryToStation = `${urls.eventLayer}/geometryToStation`;
urls.stationToGeometry = `${urls.eventLayer}/stationToGeometry`;

urls.redlineLayers = `${urls.lrsServer}/redlineLayers`;
urls.redlineLayer = `${urls.redlineLayers}/0`;

urls.centerlineLayers = `${urls.lrsServer}/centerlineLayers`;
urls.centerlineLayer = `${urls.centerlineLayers}/0`;

urls.calibrationPointLayers = `${urls.lrsServer}/calibrationPointLayers`;
urls.calibrationPointLayer = `${urls.calibrationPointLayers}/0`;

urls.intersectionLayers = `${urls.lrsServer}/intersectionLayers`;
urls.intersectionLayer = `${urls.intersectionLayers}/0`;

urls.nonLRSLayers = `${urls.lrsServer}/nonLRSLayers`;
urls.nonLRSLayer = `${urls.nonLRSLayers}/0`;

urls.locks = `${urls.lrsServer}/locks`;
urls.locksQuery = `${urls.locks}/query`;
urls.locksAcquire = `${urls.locks}/acquire`;
urls.locksRelease = `${urls.locks}/release`;

describe("urlRe", () => {
  it("regular expressions should match corresponding URLs but not others.", done => {
    for (const name in urlRe) {
      if (urlRe.hasOwnProperty(name)) {
        if (!urls.hasOwnProperty(name)) {
          done.fail(`No matching URL for ${name} RegExp (${(urlRe as any)[name]}`);
        }
        const re = (urlRe as any)[name];
        const url = urls[name];

        // Test built-in string match function.
        const match = url.match(re);
        if (!match) {
          done.fail(`${url} does not match ${re} (${name})`);
        }

        // Test validate URL function.
        try {
          validateUrl(url, re);
        } catch (ex) {
          if (ex instanceof UrlFormatError) {
            done.fail(ex);
          } else {
            throw ex;
          }
        }
      }
    }
    done();
  });
});
