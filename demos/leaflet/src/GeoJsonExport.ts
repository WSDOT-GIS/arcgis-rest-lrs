import {
  Control,
  ControlOptions,
  GeoJSON as GeoJsonLayer,
  LeafletEvent,
  Map as LMap
} from "leaflet";

export interface IGeoJsonExportOptions extends ControlOptions {
  layer: GeoJsonLayer;
}

export default class GeoJsonExport extends Control {
  public readonly layer: GeoJsonLayer;
  private readonly link: HTMLAnchorElement;
  constructor(options: IGeoJsonExportOptions) {
    super(options);
    this.layer = options.layer;
    this.link = document.createElement("a");
  }
  public onAdd(map: LMap) {
    const a = this.link;
    a.classList.add("geojson-link");
    a.title = "Right-click on link to copy GeoJSON data URL.";
    a.href = "#";
    a.textContent = "Export GeoJSON";
    a.target = "_blank";

    ["layeradd", "layerremove"].forEach(eventName => {
      this.layer.on(eventName, this.updateGeoJsonLink, this);
    });

    // Stop click event from propagating to the map.
    a.addEventListener("click", ev => {
      ev.stopImmediatePropagation();
    });

    return a;
  }
  public onRemove(map: LMap) {
    // Remove event handlers.
    this.layer.off({
      layeradd: this.updateGeoJsonLink,
      layerremove: this.updateGeoJsonLink
    });
  }
  private updateGeoJsonLink(leafletEvent: LeafletEvent) {
    const layer = leafletEvent.target as GeoJsonLayer;
    const geoJson = layer.toGeoJSON();
    const asString = JSON.stringify(geoJson);

    if (layer.getLayers().length) {
      this.link.href = `data:application/geo+json,${asString}`;
      this.link.classList.remove("disabled");
    } else {
      this.link.href = "#";
      this.link.classList.add("disabled");
    }
  }
}
