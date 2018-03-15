/**
 * This module defines classes and interfaces for creating a link
 * that exports a GeoJSON data URL from a Leaflet GeoJSON layer.
 */

import {
  Control,
  ControlOptions,
  GeoJSON as GeoJsonLayer,
  LeafletEvent,
  Map as LMap
} from "leaflet";

/**
 * Options for the GeoJsonExport control.
 */
export interface IGeoJsonExportOptions extends ControlOptions {
  /** The GeoJSON layer that will be represented by the link. */
  layer: GeoJsonLayer;
}

/**
 * A Leaflet control that contains a GeoJSON data URL link with the contents
 * of a Leaflet GeoJSON layer. The data URL is updated as items are added or removed
 * from the GeoJSON layer.
 */
export default class GeoJsonExport extends Control {
  /** The GeoJSON layer represetned by the link. */
  public readonly layer: GeoJsonLayer;
  /** The HTML <a> element. */
  private readonly link: HTMLAnchorElement;
  /**
   * Creates a new GeoJsonExport instance.
   * @param options Constructor options. Standard Leaflet control options + GeoJSON "layer" option.
   */
  constructor(options: IGeoJsonExportOptions) {
    super(options);
    this.layer = options.layer;
    this.link = document.createElement("a");
  }
  /**
   * Creates the link and adds event handlers for updating
   * the link as items are added or removed from the layer.
   * @param map The map that the layer is associated with.
   */
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
  /**
   * Removes the event handlers created by the onAdd function.
   * @param map The map that the layer is associated with.
   */
  public onRemove(map: LMap) {
    // Remove event handlers.
    this.layer.off({
      layeradd: this.updateGeoJsonLink,
      layerremove: this.updateGeoJsonLink
    });
  }
  /**
   * Updates the data URL in the anchor's href to match the
   * current contents of the GeoJSON layer.
   * @param leafletEvent Leaflet event
   */
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
