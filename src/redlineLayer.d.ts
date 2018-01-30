import { SqlDateFormat, IField } from "./common";

export interface IRedlineLayer {
  id: number;
  name: string;
  description: string;
  type: "esriLRSRedlineLayer";
  isDataVersioned: boolean;
  versionName: string;
  dateFormat: SqlDateFormat; // one of: esriLRSDateFormatStandard, esriLRSDateFormatFileGDB, esriLRSDateFormatOracle
  routeIdFieldName: string;
  routeNameFieldName: string;
  fromMeasureFieldName: string;
  toMeasureFieldName: string;
  effectiveDateFieldName: string;
  activityTypeFieldName: string;
  networkFieldName: string;
  lrs: {
    id: "<id>";
    name: "<name>";
  };
  fields: IField[];
}
