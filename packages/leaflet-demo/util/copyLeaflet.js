import { access, constants, copy } from "fs-extra";

(async () => {
  const source = "node_modules/leaflet/dist";
  try {
    await access(source, constants.R_OK);
  } catch (ex) {
    console.error(ex);
    throw ex;
  }
  try {
    await copy(source, "./leaflet");
  } catch (ex) {
    console.error(ex);
    throw ex;
  }
})();
