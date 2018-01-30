export type MeasureUnits =
  | "esriMeters"
  | "esriFeet"
  | "esriKilometers"
  | "esriMiles";

export type SqlDateFormat =
  | "esriLRSDateFormatStandard"
  | "esriLRSDateFormatFileGDB"
  | "esriLRSDateFormatOracle";

export type esriLocatingStatus =
  /** Locating was successful. */
  | "esriLocatingOK"
  /** Locating was successful, and the input point was located on more than one route. */
  | "esriLocatingMultipleLocation"
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

export interface IFieldDomain {
  type: string; // e.g., "codedValue",
  name: string;
  codedValues: Array<{ name: string; code: string | number }>;
}

export interface IField {
  name: string;
  type: string; // "<fieldType1>",
  alias: string;
  length: number;
  editable: boolean;
  nullable: boolean;
  defaultValue: any;
  domain: IFieldDomain;
}

export interface ILayerInfo {
  id: number;
  name: string;
  type: string; // TODO: create custom type with possibility string values.
}

export interface ISpatialReferenceInfo {
  // spatial reference properties of the feature data
  wkid?: number;
  wkt?: string; // WKT is included only when there is no WKID available
  xyResolution: number;
  xyTolerance: number;
  mResolution: number;
  mTolerance: number;
}

export interface ILocksResponse {
  lrs: [
    {
      id: string;
      name: string;
      conflictPreventionEnabled: boolean;
      allowLockTransfer: boolean;
      lockRootVersion: string;
      lockTableFields: {
        objectIdFieldName: string;
        networkIdFieldName: string;
        routeIdFieldName: string;
        lockUserFieldName: string;
        lockVersionFieldName: string;
        lockDateFieldName: string;
        eventFeatureClassFieldName: string;
      };
    }
  ];
}
