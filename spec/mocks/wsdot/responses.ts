export const lrsServiceInfo = {
  currentVersion: 10.51,
  capabilities: "",
  networkLayers: [
    {
      id: 0,
      name: "CRAB_Routes",
      type: "esriLRSNetworkLayer"
    }
  ],
  eventLayers: [],
  redlineLayers: [],
  centerlineLayers: [],
  calibrationPointLayers: [],
  intersectionLayers: [],
  nonLRSLayers: [],
  lrs: [
    {
      id: "ffafdc1a-d613-4c79-bb0b-f3b4b6dd5bba",
      name: "WALRS",
      description: "",
      versions: [
        {
          name: "dbo.DEFAULT",
          description: "Instance default version.",
          access: "esriVersionAccessPublic",
          parentVersion: null
        }
      ]
    }
  ],
  redlineInfos: [
    {
      featureClassName: "ROADSANDHIGHWAYS.DBO.Redline",
      isDataVersioned: false,
      versionName: null,
      dateFormat: "esriLRSDateFormatStandard",
      routeIdFieldName: "RouteId",
      routeNameFieldName: "RouteName",
      fromMeasureFieldName: "FromMeasure",
      toMeasureFieldName: "ToMeasure",
      effectiveDateFieldName: "EffectiveDate",
      activityTypeFieldName: "ActivityType",
      networkFieldName: "NetworkId",
      lrs: {
        id: "ffafdc1a-d613-4c79-bb0b-f3b4b6dd5bba",
        name: "WALRS"
      },
      fields: [
        {
          name: "OBJECTID",
          type: "esriFieldTypeOID",
          alias: "OBJECTID",
          editable: false,
          nullable: false,
          defaultValue: null,
          domain: null
        },
        {
          name: "FromMeasure",
          type: "esriFieldTypeDouble",
          alias: "FromMeasure",
          editable: true,
          nullable: true,
          defaultValue: null,
          domain: null
        },
        {
          name: "ToMeasure",
          type: "esriFieldTypeDouble",
          alias: "ToMeasure",
          editable: true,
          nullable: true,
          defaultValue: null,
          domain: null
        },
        {
          name: "RouteId",
          type: "esriFieldTypeString",
          alias: "RouteId",
          length: 255,
          editable: true,
          nullable: true,
          defaultValue: null,
          domain: null
        },
        {
          name: "RouteName",
          type: "esriFieldTypeString",
          alias: "RouteName",
          length: 12,
          editable: true,
          nullable: true,
          defaultValue: null,
          domain: null
        },
        {
          name: "EffectiveDate",
          type: "esriFieldTypeDate",
          alias: "EffectiveDate",
          length: 8,
          editable: true,
          nullable: true,
          defaultValue: null,
          domain: null
        },
        {
          name: "ActivityType",
          type: "esriFieldTypeSmallInteger",
          alias: "ActivityType",
          editable: true,
          nullable: true,
          defaultValue: null,
          domain: {
            type: "codedValue",
            name: "dActivityType",
            codedValues: [
              {
                name: "Create Route",
                code: 1
              },
              {
                name: "Calibrate Route",
                code: 2
              },
              {
                name: "Reverse Route",
                code: 3
              },
              {
                name: "Retire Route",
                code: 4
              },
              {
                name: "Extend Route",
                code: 5
              },
              {
                name: "Reassign Route",
                code: 6
              },
              {
                name: "Realign Route",
                code: 7
              }
            ]
          }
        },
        {
          name: "NetworkId",
          type: "esriFieldTypeSmallInteger",
          alias: "NetworkId",
          editable: true,
          nullable: true,
          defaultValue: null,
          domain: {
            type: "codedValue",
            name: "dLRSNetworks",
            codedValues: [
              {
                name: "SR_24K_LRS",
                code: 1
              },
              {
                name: "LAPR",
                code: 2
              },
              {
                name: "CRAB",
                code: 3
              },
              {
                name: "SR_24K_GeoLength",
                code: 4
              },
              {
                name: "SR_24K_LRS_SRMP",
                code: 5
              },
              {
                name: "SR_24k_LRS_HPMS",
                code: 6
              }
            ]
          }
        },
        {
          name: "SHAPE",
          type: "esriFieldTypeGeometry",
          alias: "SHAPE",
          editable: true,
          nullable: true,
          domain: null
        },
        {
          name: "SHAPE.STLength()",
          type: "esriFieldTypeDouble",
          alias: "SHAPE.STLength()",
          editable: false,
          nullable: false,
          defaultValue: null,
          domain: null
        }
      ]
    }
  ]
};

export const networkLayer = {
  id: 0,
  name: "CRAB_Routes",
  description: "",
  type: "esriLRSNetworkLayer",
  lrsNetworkId: 3,
  datasetName: "CRAB",
  featureClassName: "ROADSANDHIGHWAYS.DBO.CRAB",
  unitsOfMeasure: "esriMiles",
  measurePrecision: 7,
  temporalViewDate: "now",
  timeZoneOffset: -480,
  isDataVersioned: false,
  versionName: null,
  dateFormat: "esriLRSDateFormatStandard",
  spatialReferenceInfo: {
    wkid: 2927,
    xyResolution: 0.00032808333333333328,
    xyTolerance: 0.003280833333333,
    mResolution: 6.2136994949494937e-8,
    mTolerance: 6.2136994949488645e-7
  },
  routeIdFields: ["RouteId"],
  routeIdSeparator: "",
  compositeRouteIdFieldName: "RouteId",
  fromDateFieldName: "FromDate",
  toDateFieldName: "ToDate",
  routeNameFieldName: null,
  hasDominanceRules: false,
  autoGenerateRouteName: false,
  supportsLines: false,
  lrs: {
    id: "ffafdc1a-d613-4c79-bb0b-f3b4b6dd5bba",
    name: "WALRS"
  },
  eventLayers: [],
  intersectionLayers: [],
  fields: [
    {
      name: "OBJECTID",
      type: "esriFieldTypeOID",
      alias: "OBJECTID",
      editable: false,
      nullable: false,
      defaultValue: null,
      domain: null
    },
    {
      name: "FromDate",
      type: "esriFieldTypeDate",
      alias: "FromDate",
      length: 8,
      editable: true,
      nullable: true,
      defaultValue: null,
      domain: null
    },
    {
      name: "ToDate",
      type: "esriFieldTypeDate",
      alias: "ToDate",
      length: 8,
      editable: true,
      nullable: true,
      defaultValue: null,
      domain: null
    },
    {
      name: "RouteId",
      type: "esriFieldTypeString",
      alias: "RouteId",
      length: 255,
      editable: true,
      nullable: true,
      defaultValue: null,
      domain: null
    },
    {
      name: "SHAPE",
      type: "esriFieldTypeGeometry",
      alias: "SHAPE",
      editable: true,
      nullable: true,
      domain: null
    },
    {
      name: "SHAPE.STLength()",
      type: "esriFieldTypeDouble",
      alias: "SHAPE.STLength()",
      editable: false,
      nullable: false,
      defaultValue: null,
      domain: null
    }
  ]
};
