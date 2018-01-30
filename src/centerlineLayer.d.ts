import { SqlDateFormat, IField } from "./common";
import { ILrsInfo } from "./lrs";

export interface ICenterlineLayer {
  id: number;
  name: string;
  description: string;
  type: "esriLRSCenterlineLayer";
  isDataVersioned: boolean;
  versionName: string;
  dateFormat: SqlDateFormat; // one of: esriLRSDateFormatStandard, esriLRSDateFormatFileGDB, esriLRSDateFormatOracle
  centerlineIdFieldName: string;
  lrs: ILrsInfo;
  fields: IField[];
}
