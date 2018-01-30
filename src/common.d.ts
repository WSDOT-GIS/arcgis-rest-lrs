export type MeasureUnits =
  | "esriMeters"
  | "esriFeet"
  | "esriKilometers"
  | "esriMiles";

export type SqlDateFormat =
  | "esriLRSDateFormatStandard"
  | "esriLRSDateFormatFileGDB"
  | "esriLRSDateFormatOracle";

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
