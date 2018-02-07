/**
 * Converts a Date object into the integer format expected by ArcGIS Server REST endpoints.
 * @param date A date
 */
export function dateToTimeInstant(date: Date) {
  return date.getTime();
}

/**
 * Measure unit labels used by ArcGIS Server REST.
 */
export type MeasureUnits =
  | "esriMeters"
  | "esriFeet"
  | "esriKilometers"
  | "esriMiles";

/**
 * Used for indicating the date format of the underlying database of a service.
 */
export type SqlDateFormat =
  | "esriLRSDateFormatStandard"
  | "esriLRSDateFormatFileGDB"
  | "esriLRSDateFormatOracle";

/**
 * Indicates the status result of a locating operation for a given location.
 * These are possible outcomes common to both geometry-to-measure and measure-to-geometry operations.
 */
export type esriLocatingStatusCommon =
  /** Locating was successful. */
  | "esriLocatingOK"
  /** The route does not exist. */
  | "esriLocatingCannotFindRoute"
  /** The route does not have a shape or the shape is empty. */
  | "esriLocatingRouteShapeEmpty"
  /** The route does not have measures or the measures are null. */
  | "esriLocatingRouteMeasuresNull"
  /** The route is not a M-aware polyline. */
  | "esriLocatingRouteNotMAware"
  /** Could not find the route location's shape (the route has no measures or the route location's measures do not exist on the route). */
  | "esriLocatingCannotFindLocation";

/**
 * Possible outcomes for the geometry to measure operation.
 */
export type esriLocatingStatusG2M =
  | esriLocatingStatusCommon
  /** Locating was successful, and the input point was located on more than one route. */
  | "esriLocatingMultipleLocation";

/**
 * Possible outcomes for the measure to geometry operation.
 */
export type esriLocatingStatusM2G =
  | esriLocatingStatusCommon
  /** The route location's route ID is invalid (null, empty or invalid value). */
  | "esriLocatingInvalidRouteId"
  /** At least one of the route location's measure values is invalid. */
  | "esriLocatingInvalidMeasure"
  /** The from-measure is equal to the to-measure. */
  | "esriLocatingNullExtent"
  /** Could not find the route location's shape, the from-measure and the to-measure are outside of the route measures. */
  | "esriLocatingCannotFindExtent"
  /** Could not find the entire route location's shape, the from-measure is outside of the route measure range. */
  | "esriLocatingFromPartialMatch"
  /** Could not find the entire route location's shape, the to-measure is outside of the route measure range. */
  | "esriLocatingToPartialMatch"
  /** Could not find the entire route location's shape, the from-measure and the to-measure are outside of the route measure range. */
  | "esriLocatingFromToPartialMatch"
  /** The route's line ID is invalid (null, empty or invalid value). */
  | "esriLocatingInvalidLineId"
  /** The route's line order is invalid (null, empty or invalid value). */
  | "esriLocatingInvalidLineOrder"
  /** The from-route and to-route have different line IDs. */
  | "esriLocatingDifferentLineIds";

/**
 * Field domain
 */
export interface IFieldDomain {
  /** domain type */
  type: string; // e.g., "codedValue",
  /** domain's name */
  name: string;
  /** coded values of the domain */
  codedValues: Array<{ name: string; code: string | number }>;
}

/**
 * properties of a field
 */
export interface IField {
  /** field's name */
  name: string;
  /** data type */
  type: string; // "<fieldType1>",
  /** alternate name for the field, not bound by field name limitations */
  alias: string;
  /** maximum length of data in this field. */
  length?: number | null;
  /** indicates if the data in this field is editable */
  editable?: boolean;
  /** Indicates if null is a valid value in this field. */
  nullable?: boolean;
  /** The default value of this field. */
  defaultValue?: any;
  /** Domain this field  */
  domain?: IFieldDomain | null;
}

/**
 * Minimal information about a layer returned by some REST endpoints.
 */
export interface ILayerInfo {
  id: number;
  name: string;
  type: string; // TODO: create custom type with possibility string values.
}

/**
 * spatial reference properties of the feature data
 */
export interface ISpatialReferenceInfo {
  /** Well-known identifier */
  wkid?: number;
  /** Well-known Text. WKT is included only when there is no WKID available */
  wkt?: string;
  xyResolution: number;
  /** XY Tolerance */
  xyTolerance: number;
  /** M Resolution */
  mResolution: number;
  /** M Tolerance */
  mTolerance: number;
}

/**
 * Info returned by locks endpoint.
 */
export interface ILocksResponse {
  /** Array of LRS info objects */
  lrs: [
    {
      /** LRS ID */
      id: string;
      /** LRS name */
      name: string;
      /** Conflict prevention enabled */
      conflictPreventionEnabled: boolean;
      /** Allow lock transfer */
      allowLockTransfer: boolean;
      /** Lock root version */
      lockRootVersion: string;
      /** lock table fields */
      lockTableFields: {
        /** object ID field name */
        objectIdFieldName: string;
        /** network ID field name */
        networkIdFieldName: string;
        /** route ID field name */
        routeIdFieldName: string;
        /** lock user field name */
        lockUserFieldName: string;
        /** lock version field name */
        lockVersionFieldName: string;
        /** lock date field name */
        lockDateFieldName: string;
        /** event feature class field name */
        eventFeatureClassFieldName: string;
      };
    }
  ];
}
