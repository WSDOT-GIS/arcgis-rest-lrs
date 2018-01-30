import { IField, SqlDateFormat } from "./common";
import { ILrsInfo } from "./lrs";

export interface ICalibrationPointLayer {
  id: number;
  name: string;
  description: string;
  type: "esriLRSCalibrationPointLayer";
  isDataVersioned: boolean;
  versionName: string;
  dateFormat: SqlDateFormat; // one of: esriLRSDateFormatStandard, esriLRSDateFormatFileGDB, esriLRSDateFormatOracle
  routeIdFieldName: string;
  networkFieldName: string;
  fromDateFieldName: string;
  toDateFieldName: string;
  measureFieldName: string;
  lrs: ILrsInfo;
  fields: IField[];
}
