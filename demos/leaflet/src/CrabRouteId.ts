export const crabRouteIdRe = /^(53\d{3})(\d{5})([a-z])$/;

/**
 * Parts of a CRAB route ID.
 */
export interface IParsedCrabRouteId {
  /** FIPS code for the county. All WA counties' codes start with "53" and are followed with three more digits. */
  countyFipsCode: number;
  /** The remaining digits after the FIPS code that uniquely ID a road. */
  roadNumber: number;
  /** Indicates a direction, e.g., "i" for increasing. */
  direction: string;
}

/**
 * Parses a CRAB route ID into its component parts.
 * @param routeId Route ID from the LRS layer
 * @throws TypeError - Thrown if routeId is falsy.
 * @throws Error - Thrown if routeId string is not in the expected format.
 */
export function parseCrabRouteId(routeId: string): IParsedCrabRouteId {
  if (!routeId) {
    throw new TypeError(
      `The routeId cannot be falsy. Must match the following RegExp:\n${crabRouteIdRe}`
    );
  }
  const match = routeId.match(crabRouteIdRe);
  if (!match) {
    throw new Error(
      `Invalid CRAB route ID: ${routeId}. Must match ${crabRouteIdRe}`
    );
  }

  const [countyFipsCode, roadNumber] = match.slice(1, 3).map(parseInt);

  const direction = match[3];
  return {
    countyFipsCode,
    roadNumber,
    direction
  };
}
