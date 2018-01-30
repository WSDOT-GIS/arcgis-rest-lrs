import { ILrsInfo } from "./lrs";
import { ILayerInfo, IField } from "./common";

export interface IIntersectionLayer {
  id: number;
  name: string;
  description: string;
  type: string; // esriLRSIntersectionLayer
  isDataVersioned: boolean;
  versionName: string;
  dateFormat: string; // one of: esriLRSDateFormatStandard, esriLRSDateFormatFileGDB, esriLRSDateFormatOracle
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
  fields: IField[];
}
