import {
  IField,
  SqlDateFormat,
  ISpatialReferenceInfo,
  MeasureUnits,
  ILayerInfo,
} from "./common";
import { ILrsInfo } from "./lrs";

/** LRS layer type description */
export type esriLrsLayerType =
  | "esriLRSCalibrationPointLayer"
  | "esriNonLRSLayer"
  | "esriLRSCenterlineLayer"
  | "esriLRSIntersectionLayer"
  | "esriLRSPointEventLayer"
  | "esriLRSLinearEventLayer"
  | "esriLRSNetworkLayer"
  | "esriLRSRedlineLayer";

/**
 * Common properties shared between various layer types
 */
export interface ILayerBase {
  id: number;
  name: string;
  description: string;
  type: esriLrsLayerType;
  isDataVersioned: boolean;
  versionName: string;
  dateFormat: SqlDateFormat; // one of: esriLRSDateFormatStandard, esriLRSDateFormatFileGDB, esriLRSDateFormatOracle
  fields: IField[];
}

/**
 * Calibration point layer
 */
export interface ICalibrationPointLayer extends ILayerBase {
  type: "esriLRSCalibrationPointLayer";
  routeIdFieldName: string;
  networkFieldName: string;
  fromDateFieldName: string;
  toDateFieldName: string;
  measureFieldName: string;
  lrs: ILrsInfo;
}

/** Centerline layer */
export interface ICenterlineLayer extends ILayerBase {
  type: "esriLRSCenterlineLayer";
  centerlineIdFieldName: string;
  lrs: ILrsInfo;
}

/** Event layer */
export interface IEventLayer extends ILayerBase {
  type: "esriLRSPointEventLayer" | "esriLRSLinearEventLayer";
  lrsNetworkId: number; // : <networkId>,
  datasetName: string; // "<datasetName>",  // the event name registered in the LRS dataset
  featureClassName: string; // "<featureClassName>",  // the backing feature class name
  unitsOfMeasure: string; // "<units>",
  measurePrecision: number; // : <precision>,
  temporalViewDate: number; // : <timestamp>,
  timeZoneOffset: number; // : <timeZoneOffset>,  // offset from UTC time in minutes
  isRouteEventSource: boolean;
  isStaged: boolean;

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

  lrs: ILrsInfo;
  parentNetwork: ILayerInfo;
}

/** Intersection layer */
export interface IIntersectionLayer extends ILayerBase {
  type: "esriLRSIntersectionLayer";
  datasetName: string; // the intersection class name registered in the LRS dataset
  featureClassName: string; // the backing feature class name
  routeIdFieldName: string;
  intersectionIdFieldName: string;
  intersectionNameFieldName: string;
  parentNetworkDescriptionFieldName: string;
  fromDateFieldName: string;
  toDateFieldName: string;
  measureFieldName: string;
  lrs: ILrsInfo;
  parentNetwork: ILayerInfo;
  intersectingLayers: Array<{
    featureClassName: string;
    nameSeparator: string;
  }>;
}

/** Network layer */
export interface INetworkLayer extends ILayerBase {
  type: "esriLRSNetworkLayer";
  lrsNetworkId: number;
  datasetName: string; // the network name registered in the LRS dataset
  featureClassName: string; // the backing feature class name
  unitsOfMeasure: MeasureUnits;
  measurePrecision: number;
  timeZoneOffset: number; // offset from UTC time in minutes
  spatialReferenceInfo: ISpatialReferenceInfo;
  routeIdFields: string[];
  routeIdSeparator: string;
  compositeRouteIdFieldName: string;
  fromDateFieldName: string;
  toDateFieldName: string;
  routeNameFieldName: string;
  hasDominanceRules: boolean;
  autoGenerateRouteName: boolean;

  // line support properties
  supportsLines: boolean;
  lineIdFieldName: string;
  lineNameFieldName: string;
  lineOrderFieldName: string;

  lrs: ILrsInfo;
  eventLayers: ILayerInfo[];
  intersectionLayers: ILayerInfo[];
}

/** Non-LRS layer */
export interface INonLrsLayer extends ILayerBase {
  type: "esriNonLRSLayer";
  featureClassName: string; // the backing feature class name
}

/** Redline layer */
export interface IRedlineLayer extends ILayerBase {
  type: "esriLRSRedlineLayer";
  routeIdFieldName: string;
  routeNameFieldName: string;
  fromMeasureFieldName: string;
  toMeasureFieldName: string;
  effectiveDateFieldName: string;
  activityTypeFieldName: string;
  networkFieldName: string;
  lrs: ILrsInfo;
}
