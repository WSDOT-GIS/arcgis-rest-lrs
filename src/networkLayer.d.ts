import { SqlDateFormat, ILayerInfo, IField, MeasureUnits, ISpatialReferenceInfo } from "./common";



export interface INetworkLayer {
    id : number,
    name : string,
    description : string
    type : "esriLRSNetworkLayer"
    lrsNetworkId : number;
    datasetName : string,  // the network name registered in the LRS dataset
    featureClassName : string,  // the backing feature class name
    unitsOfMeasure : MeasureUnits,
    measurePrecision : number;
    timeZoneOffset : number,  // offset from UTC time in minutes
    isDataVersioned : boolean,
    versionName : string,
    dateFormat : SqlDateFormat,  //one of: esriLRSDateFormatStandard, esriLRSDateFormatFileGDB, esriLRSDateFormatOracle
    spatialReferenceInfo : ISpatialReferenceInfo,
    routeIdFields : string[],
    routeIdSeparator : string,
    compositeRouteIdFieldName : string,
    fromDateFieldName : string,
    toDateFieldName : string,
    routeNameFieldName : string,
    hasDominanceRules : boolean,
    autoGenerateRouteName : boolean,

    // line support properties
    supportsLines : boolean,
    lineIdFieldName : string,
    lineNameFieldName : string,
    lineOrderFieldName : string,

    lrs : {
      id : string;
      name : string;
    },
    eventLayers : ILayerInfo[],
    intersectionLayers : ILayerInfo[],
    fields : IField[]
  }