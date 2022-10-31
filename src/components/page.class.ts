import { FlipperPageInterface } from "../types/page";
import { FlipperPageSetting } from "../types/options";
import { Draggable } from "./draggable.class";

interface FlipperPageSites {
  front: HTMLDivElement, back: HTMLDivElement
}

export class FlipperPage extends Draggable implements FlipperPageInterface {

  public id: number;
  public width: number;
  public height: number;
  public flipped: boolean = false;

  private sites: FlipperPageSites = { front: null, back: null};
  private _isProcessing = false;
  private options: FlipperPageSetting;
  private _zIndex: number;
  private _onTop: boolean = false;

  constructor(
    id: number,
    parent: HTMLElement,
    content: string | {front: string, back: string},
    options: FlipperPageSetting
  ) {
    super();
    if (!options.klass) throw new Error("CSS class should be passed to page component");
    this.options = options;
    this.id = id;
    this.HTMLNode = this.createNode(this.options);
    this.HTMLNode.classList.add(options.klass);
    if (options.shadow) this.HTMLNode.classList.add(this.cssKlasses.shadowed);
    this.addSubscriptions();
    this.addContent(content);
    parent.appendChild(this.HTMLNode);
    // this.transitionSwitcher();
    this.width = this.HTMLNode.clientWidth;
    this.height = this.HTMLNode.clientHeight;
  }

  get cssKlasses(): {[key: string]: string} {
    return {
      flipped: `${this.options.klass}--flipped`,
      front: `${this.options.klass}--front`,
      back: `${this.options.klass}--back`,
      blank: `${this.options.klass}--blank`,
      processing: `${this.options.klass}--processing`,
      shadowed: `${this.options.klass}--shadowed`,
      top: `${this.options.klass}--top`,
      hover: "hover",
    }
  }

  set zIndex(value: number) {
    this._zIndex = value;
    this.HTMLNode.style.zIndex = this._zIndex + '';
  }

  get zIndex() {
    return this._zIndex;
  }

  set isProcessing(value: boolean) {
    this._isProcessing = value;
    value
      ? this.HTMLNode.classList.add(this.cssKlasses.processing)
      : this.HTMLNode.classList.remove(this.cssKlasses.processing);
  }

  get isProcessing() {
    return this._isProcessing;
  }

  set onTop(value: boolean) {
    this._onTop = value;
    this.HTMLNode.classList.toggle(this.cssKlasses.top, value);
  }

  get onTop(): boolean {
    return this._onTop;
  }

  public flip(callback?: () => void) {
    this.clearHover();
    this.beforeTransition(callback);
    this.HTMLNode.classList.toggle(this.cssKlasses.flipped);
    this.flipped = !this.flipped;
  }

  public onDragStart(event: PointerEvent) {
    this.transitionSwitcher(false);
  }

  public onDragMove(event: PointerEvent) {
    super.onDragMove(event);

    let angle = this.getAngle();
    const rotor = {
      up: `rotateX(${this.flipped ? 180 + angle : angle}deg)`,
      left: `rotateY(${this.flipped ? - 180 - angle : -1 * angle}deg)`,
    };
    this.HTMLNode.style.transform = rotor[this.options.direction];
  }

  public onDragEnd(event: PointerEvent) {
    this.transitionSwitcher(true);

    console.log(this.getAngle(), this.coordinates)

    if (this.getAngle()) {
      this.beforeTransition();
    } else {
      if (!this.coordDiff(this.options.direction)) this.HTMLNode.dispatchEvent(new Event("click"));
    }
  }

  public getAngle(): number {
    let angle = this.options.direction === "left"
      ? this._getAngle(this.width, "x")
      : this._getAngle(this.height, "y");
    if (!this.flipped) {
      if (angle < 1) angle = 1;
      if (angle > 179) angle = 179;
    } else {
      if (angle > 1) angle = 1;
      if (angle < -179) angle = -179;
    }
    return angle;
  }

  public transitionSwitcher(switchKey = true) {
    this.applyStyles({
      transform: "",
      transitionDuration: switchKey ? this.options.duration + 'ms' : '',
    });
  }

  /**
   * if one end of radius is fixed, then X or Y difference
   * between start drag position and current will allow us to calculate and angle diff
   * @param   radius  radius to be rotated
   * @param   dir     needed direction of rotation
   * @return  provides an angle in grad
   */
  private _getAngle(radius: number, dir: "x" | "y"): number {
    return 90 * (this.coordinates.start[dir] - this.coordinates.current[dir]) / radius;
  }

  private onMouseEnter() {
    if (this.isProcessing || !this.onTop) return;
    this.HTMLNode.classList.add(this.cssKlasses.hover)
  }

  private onMouseLeave() {
    if (this.isProcessing) return;
    this.clearHover();
  }

  private clearHover() {
    if (this.HTMLNode.classList.contains(this.cssKlasses.hover)) {
      this.HTMLNode.classList.remove(this.cssKlasses.hover)
    }
  }

  private beforeTransition(callback?: () => void) {
    const removeProzessingKlass = (event: TransitionEvent) => {
      if (event.propertyName !== "transform") return;
      this.isProcessing = false;
      this.HTMLNode.removeEventListener("transitionend", removeProzessingKlass);
      this.resetCoordinates();
      if (typeof callback === "function") callback();
    }
    this.isProcessing = true;
    this.subscribe("transitionend", removeProzessingKlass);
  }

  private createNode(options: FlipperPageSetting): HTMLDivElement {
    const pageNode = document.createElement("div");
    pageNode.style.height = options.height;
    pageNode.style.width = options.width;
    return pageNode;
  }

  private addImage(parent: HTMLDivElement, src: string) {
    parent.appendChild(this.generateImageNode(src));
  }

  private generateImageNode(src: string) {
    const imageNode = document.createElement("img");
    imageNode.src = src;
    return imageNode;
  }

  private addContent(content: string | {front: string, back: string}) {
    this.sites.front = this.createNode(this.options);
    this.sites.back = this.createNode(this.options);
    this.sites.front.classList.add(this.cssKlasses.front);
    this.sites.back.classList.add(this.cssKlasses.back);

    if (typeof content === "object") {
      this.fillNode(this.sites.front, content.front);
      this.fillNode(this.sites.back, content.back);
    } else {
      this.fillNode(this.sites.front, content);
      this.sites.back.classList.add(this.cssKlasses.blank);
    }

    this.HTMLNode.appendChild(this.sites.front);
    this.HTMLNode.appendChild(this.sites.back);
  }

  private fillNode(parent: HTMLDivElement, content: string) {
    this.isLink(content)
      ? this.addImage(parent, content)
      : parent.innerHTML = content;
  }

  private addSubscriptions() {
    if (this.options.hover) this.subscribe("mouseenter", this.onMouseEnter.bind(this));
    if (this.options.hover) this.subscribe("mouseleave", this.onMouseLeave.bind(this));
    super.subscribeDrag();
  }

  private isLink(str: string): boolean {
    return /^https?:\/\//.test(str);
  }

  private applyStyles(styles: {[key: string]: any}) {
    Object.assign(this.HTMLNode.style, styles);
  }

}
