import { Control, ControlOptions, Map as LeafletMap } from "leaflet";
import Collapseable from "./Collapsible";
import { generateId } from "./conversion";

/**
 * GeometryToMeasureSettings initialization options.
 */
export interface IG2MOptions extends ControlOptions {
  /** The default value to use when the form is reset. */
  defaultTolerance?: number;
}

/**
 * Creates controls for the UI.
 * @param options Initialization options
 */
function createControls(root: HTMLElement, options?: IG2MOptions) {
  const toleranceInput = document.createElement("input");
  toleranceInput.id = generateId("g2mTolerance");
  toleranceInput.name = "tolerance";
  toleranceInput.min = "0";
  if (options && options.defaultTolerance) {
    toleranceInput.value = `${options.defaultTolerance}`;
  }

  let label = document.createElement("label");
  label.textContent = "Tolerance";
  label.htmlFor = toleranceInput.id;

  [label, toleranceInput].forEach(c => root.appendChild(c));

  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.id = generateId("temporalViewDate");

  label = document.createElement("label");
  label.textContent = "Temporal View Date";
  label.htmlFor = dateInput.id;

  [label, dateInput].forEach(c => root.appendChild(c));

  return { toleranceInput, dateInput };
}

/**
 * UI control where user can adjust options for geometryToMeasure queries.
 */
export default class GeometryToMeasureSettings extends Collapseable {
  private readonly _toleranceInput: HTMLInputElement;
  private readonly _temporalViewDateInput: HTMLInputElement;

  /**
   * Returns the "tolerance" value if present, or null otherwise.
   */
  public get tolerance() {
    const value = this._toleranceInput.value;
    if (!value) {
      return null;
    }
    return parseInt(value, 10);
  }

  /**
   * Returns the temporalViewDate value.
   */
  public get temporalViewDate() {
    return this._temporalViewDateInput.value
      ? this._temporalViewDateInput.valueAsDate
      : null;
  }

  /**
   * Creates a new instance of the control.
   * @param options Control options
   */
  constructor(options?: IG2MOptions) {
    super(options);
    this.rootElement.classList.add("leaflet-control-g2m-settings");
    const gridDiv = document.createElement("div");
    gridDiv.classList.add("grid");
    this.contentElement.appendChild(gridDiv);
    const { toleranceInput, dateInput } = createControls(gridDiv, options);
    this._toleranceInput = toleranceInput;
    this._temporalViewDateInput = dateInput;
  }

  /**
   * This function runs after the control is added to the map.
   * @param map A Leaflet Map.
   */
  public onAdd(map: LeafletMap) {
    const elements = this.rootElement.querySelectorAll("input,label");
    if (elements) {
      Array.from(elements).forEach(e => {
        ["click", "dblclick"].forEach(evtName => {
          e.addEventListener(evtName, control =>
            control.stopImmediatePropagation()
          );
        });
      });
    }
    return this.rootElement;
  }

  /**
   * This function runs when the control is removed from the map.
   */
  public onRemove() {
    return this;
  }
}
