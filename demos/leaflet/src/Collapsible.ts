/**
 * This module defines a "Collapsible" Leaflet control.
 */

import { Control, ControlOptions } from "leaflet";

/**
 * A control that will normally be collapsed into an icon
 * but be expanded when the user either mouses over the icon
 * or touches it on a mobile device.
 *
 *
 * HTML Elements:
 * ```html
 * <div class="control-root">
 *  <div class="control-icon"></div>
 *  <div class="control-content"></div>
 * </div>
 * ```
 * No Collapse / Expand logic is contained in the code: this is
 * handled via CSS.
 *
 * ```less
 * .control-root {
 *   background: white;
 *   border-radius: 5px;
 *   box-shadow: 1px 1px 1px 2px rgba(0, 0, 0, 0.4);
 * }
 *
 * .control-content {
 *   margin: 1em;
 * }
 *
 * .control-icon::after {
 *   content: "⚙️";
 *   font-size: 2em;
 *   margin: 0;
 * }
 *
 * .leaflet-control-route-input .control-icon::after {
 *   content: "🦀";
 * }
 *
 * .control-root .control-content,
 * .control-root:hover .control-icon {
 *   display: none;
 * }
 *
 * .control-root:hover .control-content {
 *   display: block;
 * }
 * ```
 *
 */
export default class Collapsible extends Control {
  protected readonly rootElement: HTMLDivElement;
  protected readonly iconElement: HTMLDivElement;
  protected readonly contentElement: HTMLDivElement;

  /**
   * Creates a new Control instance.
   * @param options Standard Leaflet control options.
   */
  constructor(options?: ControlOptions) {
    super(options);

    this.rootElement = document.createElement("div");
    this.rootElement.classList.add("control-root");

    this.iconElement = document.createElement("div");
    this.iconElement.classList.add("control-icon");

    this.contentElement = document.createElement("div");
    this.contentElement.classList.add("control-content");

    [this.iconElement, this.contentElement].forEach(el => {
      this.rootElement.appendChild(el);
    });
  }
}
