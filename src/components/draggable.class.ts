import { Direction } from "../types/options";

interface Coords {x: number, y: number};

interface CoordinateTrack { start: Coords, current: Coords};

export class Draggable {

  public THROTTLE_PERIOD = 3;

  public DRAGGING_ZI = 2967;

  private _HTMLNode: HTMLElement;

  private throttleTimeout: undefined | number;

  protected coordinates: CoordinateTrack = {
    start: {x: 0, y: 0},
    current: {x: 0, y: 0},
  };

  public set HTMLNode(value: HTMLElement) {
    this._HTMLNode = value;
  }

  public get HTMLNode(): HTMLElement {
    return this._HTMLNode;
  }

  public subscribe(event: string, callback: (event: Event) => void) {
    this.HTMLNode.addEventListener(event, callback)
  }

  public unsubscribe(event: string, callback: (event: Event) => void) {
    this.HTMLNode.removeEventListener(event, callback)
  }

  public onDragStart(event: PointerEvent) {
    // NOTE: could be redefined fron ancestor
  }

  public onDragMove(event: PointerEvent) {
    // NOTE: could be redefined fron ancestor
  }

  public onDragEnd(event: PointerEvent) {
    // NOTE: could be redefined fron ancestor
  }

  protected subscribeDrag() {
    this.subscribe("touchstart", this._onDragStart.bind(this));
  }

  protected triggerEvent(name: string) {
    this.HTMLNode.dispatchEvent(new Event(name));
  }

  protected resetCoordinates() {
    this.coordinates = {
      start: {x: 0, y: 0},
      current: {x: 0, y: 0},
    };
  }

  protected coordDiff(direction: Direction): number {
    const axe = direction === "left" ? "x" : "y";
    return this.coordinates.start[axe] - this.coordinates.current[axe];
  }

  private _onDragStart(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.resetCoordinates();

    const initialZi = this.HTMLNode.style.zIndex;
    this.HTMLNode.style.zIndex = this.DRAGGING_ZI + '';
    this.onDragStart(event);
    this.triggerEvent("draggable:start");

    const mover = this._onDragMove.bind(this);
    const ender = (e: PointerEvent) => {
      this.unsubscribe("touchmove", mover);
      this.unsubscribe("touchend", ender);
      clearTimeout(this.throttleTimeout);
      this.throttleTimeout = undefined;
      this.HTMLNode.style.zIndex = initialZi;
      this.onDragEnd(event);
      this.triggerEvent("draggable:end");
    };
    this.subscribe("touchmove", mover);
    this.subscribe("touchend",  ender);
  }

  private _onDragMove(event: PointerEvent) {
    if (this.throttleTimeout) return;
    this.throttleTimeout = window.setTimeout(() => {
      if (!this.coordinates.start.x && !this.coordinates.start.x) this.updateCoords(event, "start");
      this.updateCoords(event);
      this.throttleTimeout = undefined;
      this.onDragMove(event);
      // this.triggerEvent("draggable:move");
    }, this.THROTTLE_PERIOD)
  }

  private updateCoords(event: PointerEvent | TouchEvent, key: keyof CoordinateTrack = "current") {
    const screenPoint = event instanceof TouchEvent
      ? event.touches[0]
      : event;
    this.coordinates[key] = {
      x: screenPoint.clientX,
      y: screenPoint.clientY,
    };
  }

}
