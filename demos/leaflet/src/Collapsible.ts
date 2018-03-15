import { Control, ControlOptions } from "leaflet";

export default class Collapsible extends Control {
  protected readonly rootElement: HTMLDivElement;
  protected readonly iconElement: HTMLDivElement;
  protected readonly contentElement: HTMLDivElement;

  /**
   *
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
