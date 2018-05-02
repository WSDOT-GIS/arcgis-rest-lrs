import { IG2MOutput, IM2GOutput } from "@wsdot/arcgis-rest-lrs";
import {
  Point as IRestPoint,
  Polyline as IRestPolyline
} from "arcgis-rest-api";

export const defaultLrsMapServiceUrl =
  "https://data.wsdot.wa.gov/arcgis/rest/services/CountyRoutes/CRAB_Routes/MapServer";

export const defaultLrsSvcUrl = `${defaultLrsMapServiceUrl}/exts/LRSServer`;
export const defaultLayerId = 0;

/**
 *
 * @param mapServiceUrl URL to map service or feature service
 * @param layerId Layer ID
 * @param endpointName The name of the operation. E.g., "measureToGeometry".
 * @throws Error Throws an error if the mapServiceUrl is not in the correct format.
 */
export function getLrsServerEndpointUrl(
  mapServiceUrl: string,
  layerId: number,
  endpointName: "geometryToMeasure" | "measureToGeometry" | string
) {
  const urlRe = /^(?:https?:)?\/\/.+\/(Map|Feature)Server\b/i;
  const match = mapServiceUrl.match(urlRe);
  if (!match) {
    throw Error(`URL is not in expected format: "${mapServiceUrl}".`);
  }
  return `${mapServiceUrl}/exts/LRSServer/${layerId}/${endpointName}`;
}

/**
 * Creates a unique ID by appending numbers to the proposed ID until
 * an ID that is not already in use is found.
 * @param id Proposed ID
 */
export function generateId(id: string) {
  let outId = id;
  let i = 0;
  while (document.getElementById(outId)) {
    outId = `${id}${i}`;
    i++;
  }
  return outId;
}

/**
 * Splits a camel- or Pascal-cased name into separate words.
 * @param name camel- or Pascal-cased name
 */
export function splitName(name?: string | null) {
  if (!name) {
    return null;
  }
  const re = /[A-Z]?[a-z]+/g;
  let match = re.exec(name);
  const parts = new Array<string>();
  while (match) {
    const part = match[0].toLowerCase();
    parts.push(part);
    match = re.exec(name);
  }

  return parts.join(" ");
}

export function addNamedControlsToElement(
  root: HTMLElement | DocumentFragment,
  elements: {
    [name: string]: HTMLInputElement | HTMLSelectElement;
  }
) {
  const labels: {
    [key: string]: HTMLLabelElement;
  } = {};
  for (const name in elements) {
    if (elements.hasOwnProperty(name)) {
      const element = elements[name];
      const label = addToFormWithLabel(root, element, name);
      labels[name] = label;
    }
  }
  return labels;
}

export function addToFormWithLabel(
  form: HTMLElement | DocumentFragment,
  control: HTMLInputElement | HTMLSelectElement,
  labelText?: string
) {
  const label = document.createElement("label");
  label.htmlFor = control.id;
  label.textContent = labelText || splitName(control.name);
  form.appendChild(label);
  form.appendChild(control);
  return label;
}

function* flattenPathsToPoints(paths: number[][][]) {
  for (const path of paths) {
    for (const point of path) {
      const [x, y] = point;
      const z = point.length > 2 ? point[2] : null;
      const m = point.length > 3 ? point[3] : null;
      yield { x, y, z, m };
    }
  }
}

export function getStartAndEndMeasures(
  polyline: IRestPolyline
): [number | null, number | null] {
  if (!polyline.hasM) {
    return [null, null];
  }

  const beginM = polyline.paths[0][0][3];
  const lastPath = polyline.paths[polyline.paths.length - 1];
  const lastPoint = lastPath[lastPath.length - 1];
  const endM = lastPoint[3];

  return [beginM, endM];
}
