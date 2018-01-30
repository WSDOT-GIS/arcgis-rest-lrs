import { ILrsInfo, ILrsServiceInfo } from "../../src/lrs";

export const LrsInfo: ILrsServiceInfo = {
  currentVersion: 10.4,
  capabilities: "",
  networkLayers: [
    {
      id: 2,
      name: "Mile Marker",
      type: "esriLRSNetworkLayer"
    },
    {
      id: 3,
      name: "Named Route",
      type: "esriLRSNetworkLayer"
    }
  ],
  eventLayers: [
    {
      id: 0,
      name: "Marker Events",
      type: "esriLRSPointEventLayer"
    },
    {
      id: 1,
      name: "Functional Class",
      type: "esriLRSLinearEventLayer"
    }
  ],
  redlineLayers: [
    {
      id: 4,
      name: "Redline",
      type: "esriLRSRedlineLayer"
    }
  ],
  centerlineLayers: [],
  calibrationPointLayers: [],
  intersectionLayers: [],
  nonLRSLayers: [],
  lrs: [
    {
      id: "b91392a6-076a-4c2f-9ccb-ac1ea34cd437",
      name: "ALRS",
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
  ]
};