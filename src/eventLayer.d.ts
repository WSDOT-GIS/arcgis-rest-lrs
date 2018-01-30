import {
  SqlDateFormat,
  ISpatialReferenceInfo,
  IField,
  ILayerInfo,
  MeasureUnits
} from "./common";

export interface IEventLayer {
  id: number;
  name: string; // "<layerName>",
  description: string; // "<description>",
  type: "esriLRSPointEventLayer" | "esriLRSLinearEventLayer";
  lrsNetworkId: number; // : <networkId>,
  datasetName: string; // "<datasetName>",  // the event name registered in the LRS dataset
  featureClassName: string; // "<featureClassName>",  // the backing feature class name
  unitsOfMeasure: string; // "<units>",
  measurePrecision: number; // : <precision>,
  temporalViewDate: number; // : <timestamp>,
  timeZoneOffset: number; // : <timeZoneOffset>,  // offset from UTC time in minutes
  isDataVersioned: boolean;
  versionName: string; // "<versionName>",
  isRouteEventSource: boolean;
  isStaged: boolean;
  dateFormat: SqlDateFormat; // one of: esriLRSDateFormatStandard, esriLRSDateFormatFileGDB, esriLRSDateFormatOracle

  // spatial reference properties of the feature data
  spatialReferenceInfo: ISpatialReferenceInfo;

  eventIdFieldName: string; // "<fieldName>",
  routeIdFieldName: string; // "<fieldName>",
  routeNameFieldName: string; // "<fieldName>",
  fromMeasureFieldName: string; // "<fieldName>",
  toMeasureFieldName: string; // "<fieldName>",  // only valid for linear events
  fromDateFieldName: string; // "<fieldName>",
  toDateFieldName: string; // "<fieldName>",
  locErrorFieldName: string; // "<fieldName>",

  // line support properties, only valid for linear events
  canSpanRoutes: boolean;
  toRouteIdFieldName: string; // "<fieldName>",
  toRouteNameFieldName: string; // "<fieldName>",

  // referent offset properties
  hasReferentLocation: boolean;
  referentOffsetUnits: MeasureUnits; // "<units>",
  fromReferentMethodFieldName: string; // "<fieldName>",
  fromReferentLocationFieldName: string; // "<fieldName>",
  fromReferentOffsetFieldName: string; // "<fieldName>",
  toReferentMethodFieldName: string; // "<fieldName>",  // only valid for linear events
  toReferentLocationFieldName: string; // "<fieldName>",  // only valid for linear events
  toReferentOffsetFieldName: string; // "<fieldName>",  // only valid for linear events

  // stationing properties
  isStationEvent: boolean;
  stationUnits: string; // "<units>",
  stationFieldName: string; // "<fieldName>",
  backStationFieldName: string; // "<fieldName>",
  stationMeasureDirectionFieldName: string; // "<fieldName>",
  stationMeasureDecreaseValues: string[]; // "<value1>", string; // "<value2>", ... ],

  lrs: {
    id: string; // "<id>",
    name: string; // "<name>"
  };
  parentNetwork: ILayerInfo;
  fields: IField[];
}
