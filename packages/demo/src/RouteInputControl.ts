/**
 * This module defines the class that manages the route input controls
 */

import {
  Control,
  ControlOptions,
  DomEvent,
  LeafletMouseEvent,
  Map as LeafletMap
} from "leaflet";
import { crabRouteIdRe } from "./CrabRouteId";
import { generateId } from "./conversion";
import Collabsible from "./Collapsible";

function handleEvent(e: Event) {
  DomEvent.stop(e);
}

export interface IRouteSubmitData {
  routeId: string;
  measure?: number;
  fromMeasure?: number;
  toMeasure?: number;
}

/**
 * Route input controls
 */
export default class RouteInput extends Collabsible {
  public readonly form: HTMLFormElement;

  /**
   * Creates a new instance of this class.
   */
  constructor(options?: ControlOptions) {
    super(options);
    this.form = document.createElement("form");
    this.form.classList.add("grid");
  }

  /**
   * Creates the DOM element used by the control.
   * @param map Map
   */
  public onAdd(map: LeafletMap): HTMLElement {
    this.rootElement.classList.add("leaflet-control-route-input");
    const frag = document.createDocumentFragment();

    function createMeasureControl(
      id: string,
      name: string,
      required: boolean = false
    ) {
      const mId = generateId(id);
      const mControl = document.createElement("input");
      mControl.required = required;
      mControl.type = "number";
      mControl.min = "0";
      mControl.step = "0.001";
      mControl.name = name;
      return mControl;
    }

    frag.appendChild(this.form);

    // Route ID
    const routeIdId = generateId("routeIdControl");
    const routeIdControl = document.createElement("input");
    routeIdControl.id = routeIdId;
    routeIdControl.name = "routeId";
    routeIdControl.required = true;
    routeIdControl.pattern = crabRouteIdRe.source;
    routeIdControl.placeholder = "CRAB Route ID";

    const fromMControl = createMeasureControl(
      "fromMeasureControl",
      "measure",
      true
    );
    const toMControl = createMeasureControl(
      "toMeasureControl",
      "toMeasure",
      false
    );

    // Add the input controls to the form along with labels.
    new Array<[HTMLInputElement, string]>(
      [routeIdControl, "Route ID"],
      [fromMControl, "Measure"],
      [toMControl, "To Measure"]
    ).forEach(c => {
      const control = c[0];
      const labelText = c[1];

      const label = document.createElement("label");
      label.textContent = labelText;
      label.htmlFor = control.id;
      this.form.appendChild(label);
      this.form.appendChild(control);
    });

    toMControl.title = "Leave empty when locating points.";

    const [submitButton, clearButton] = ["Submit", "Reset"].map(text => {
      const btn = document.createElement("button");
      btn.type = text.toLowerCase();
      btn.textContent = text;
      this.form.appendChild(btn);
      return btn;
    });

    this.contentElement.appendChild(frag);

    // DomEvent.on(this.outerDiv, "click", handleEvent);

    this.form.addEventListener("submit", ev => {
      const detail: any = {
        routeId: routeIdControl.value
      };
      if (!toMControl.value) {
        detail.measure = fromMControl.valueAsNumber;
      } else {
        detail.fromMeasure = fromMControl.valueAsNumber;
        detail.toMeasure = toMControl.valueAsNumber;
      }
      const customEvent = new CustomEvent<IRouteSubmitData>("route-m-select", {
        detail
      });
      this.form.dispatchEvent(customEvent);
      ev.preventDefault();
    });

    // Stop the click events from applying to the map.
    Array.from(this.form.querySelectorAll("input,label,button")).forEach(c => {
      ["click", "dblclick"].forEach(evtName => {
        c.addEventListener(evtName, this._stopProp);
      });
    });

    return this.rootElement;
  }
  /**
   * onRemove
   */
  public onRemove(map: LeafletMap) {
    // DomEvent.off(this.outerDiv, "click", handleEvent);
    Array.from(this.form.querySelectorAll("input,label,button")).forEach(c => {
      ["click", "dblclick"].forEach(evtName => {
        c.removeEventListener(evtName, this._stopProp);
      });
    });
  }

  /** Stops propagation of further events. */
  protected readonly _stopProp = (e: Event) => e.stopImmediatePropagation();
}

export function routeInput(options?: ControlOptions) {
  return new RouteInput(options);
}
