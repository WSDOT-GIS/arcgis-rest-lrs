import { IField, SqlDateFormat } from "./common";

export interface INonLrsLayer {
  id: number;
  name: string;
  description: string;
  type: "esriNonLRSLayer";
  featureClassName: string; // the backing feature class name
  isDataVersioned: boolean;
  versionName: string;
  dateFormat: SqlDateFormat; //one of: esriLRSDateFormatStandard, esriLRSDateFormatFileGDB, esriLRSDateFormatOracle
  fields: IField[];
}
