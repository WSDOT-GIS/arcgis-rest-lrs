export const lrsServer = /^https?:\/\/.+\/MapServer\/exts\/LRSServer\b/;
export const allLayers = new RegExp(`${lrsServer.source}/layers\\b`);
export const applyEdits = new RegExp(`${lrsServer.source}/applyEdits\\b`);
export const createVersion = new RegExp(`${lrsServer.source}/createVersion\\b`);
export const deleteVersion = new RegExp(`${lrsServer.source}/deleteVersion\\b`);
export const reconcileVersion = new RegExp(`${lrsServer.source}/reconcileVersion\\b`);

export const networkLayers = new RegExp(`${lrsServer.source}/networkLayers\\b`);
export const networkLayer = new RegExp(`${networkLayers.source}/\\d+\\b`);
export const geometryToMeasure = new RegExp(`${networkLayer.source}/geometryToMeasure\\b`);
export const measureToGeometry = new RegExp(`${networkLayer.source}/measureToGeometry\\b`);
export const translate = new RegExp(`${networkLayer.source}/translate\\b`);
export const concurrencies = new RegExp(`${networkLayer.source}/concurrencies\\b`);
export const queryAttributeSet = new RegExp(`${networkLayer.source}/queryAttributeSet\\b`);
export const checkEvents = new RegExp(`${networkLayer.source}/checkEvents\\b`);

export const eventLayers = new RegExp(`${lrsServer.source}/eventLayers\\b`);
export const eventLayer = new RegExp(`${eventLayers.source}/\\d+\\b`);
export const geometryToStation = new RegExp(`${eventLayer.source}/geometryToStation\\b`);
export const stationToGeometry = new RegExp(`${eventLayer.source}/stationToGeometry\\b`);

export const redlineLayers = new RegExp(`${lrsServer.source}/redlineLayers\\b`);
export const redlineLayer = new RegExp(`${redlineLayers.source}/\\d+\\b`);

export const centerlineLayers = new RegExp(`${lrsServer.source}/centerlineLayers\\b`);
export const centerlineLayer = new RegExp(`${centerlineLayers.source}/\\d+\\b`);

export const calibrationPointLayers = new RegExp(`${lrsServer.source}/calibrationPointLayers\\b`);
export const calibrationPointLayer = new RegExp(`${calibrationPointLayers.source}/\\d+\\b`);

export const intersectionLayers = new RegExp(`${lrsServer.source}/intersectionLayers\\b`);
export const intersectionLayer = new RegExp(`${intersectionLayers.source}/\\d+\\b`);

export const nonLRSLayers = new RegExp(`${lrsServer.source}/nonLRSLayers\\b`);
export const nonLRSLayer = new RegExp(`${nonLRSLayers.source}/\\d+\\b`);

export const locks = new RegExp(`${lrsServer.source}/locks\\b`);
export const locksQuery = new RegExp(`${locks.source}/query\\b`);
export const locksAcquire = new RegExp(`${locks.source}/acquire\\b`);
export const locksRelease = new RegExp(`${locks.source}/release\\b`);