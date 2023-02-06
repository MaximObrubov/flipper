import { FlipperPageSetting } from "../types/options";
import { Transformation } from "../types/transformation";
import { Draggable } from "./draggable.class";
import { animateByStep } from "../utils/animate";
import { Flipper } from "../flipper.class";

interface FlipperPageSites {
  front: HTMLDivElement, back: HTMLDivElement
}

export class FlipperPage extends Draggable {

  public id: number;
  public flipped: boolean = false;
  public shadow: HTMLDivElement | null = null;
  public isLast: boolean = false;
  public isFirst: boolean = false;

  protected sites: FlipperPageSites = { front: null, back: null};
  protected options: FlipperPageSetting;
  protected currentHoverAngle: number = 0;

  private _isProcessing = false;
  private _zIndex: number;
  private _onTop: boolean = false;
  private _angle: number = 0;
  private _hoverAngle: number = 0;
  public _scale: number = 1;
  private _flipper: Flipper;

  constructor(
    id: number,
    flipper: Flipper,
    parent: HTMLElement,
    content: string | {front: string, back: string},
    options: FlipperPageSetting
  ) {
    super();
    if (!options.klass) throw new Error("CSS class should be passed to page component");
    this.options = options;
    this._flipper = flipper;
    this.id = id;
    this.HTMLNode = this.createNode(this.options);
    this.HTMLNode.classList.add(options.klass);

    this.HTMLNode.classList.add(this._flipper.isTouch ? this.cssKlasses.touch : this.cssKlasses.desktop);

    if (options.shadow) this.HTMLNode.classList.add(this.cssKlasses.shadowed);
    if (options.shadow) {
      this.shadow = this.createNode(this.options);
      this.shadow.classList.add(this.cssKlasses.shadow);
      this.HTMLNode.appendChild(this.shadow);
    }

    this.addSubscriptions();
    this.addContent(content);
    parent.appendChild(this.HTMLNode);
  }

  get cssKlasses(): {[key: string]: string} {
    return {
      flipped: `${this.options.klass}--flipped`,
      front: `${this.options.klass}--front`,
      back: `${this.options.klass}--back`,
      blank: `${this.options.klass}--blank`,
      processing: `${this.options.klass}--processing`,
      shadowed: `${this.options.klass}--shadowed`,
      shadow: `${this.options.klass}--shadow`,
      top: `${this.options.klass}--top`,
      touch: `${this.options.klass}--touch`,
      desktop: `${this.options.klass}--desktop`,
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

  set scale(value: number) {
    this._scale = value;
    this.applyTransformation({scale: this._scale, angle: this._angle});
  }

  get scale(): number {
    return this._scale;
  }

  public flip(callback?: () => void) {
    this.HTMLNode.classList.toggle(this.cssKlasses.flipped);
    this.isProcessing = true;

    const angles = {
      left: this.flipped ? 0 : -180,
      up: this.flipped ? 0 : 180,
    }

    animateByStep(
      this._angle,
      angles[this.options.direction],
      this.options.duration,
      this.setAngle.bind(this)
    ).then(() => {
      this.isProcessing = false;
      this.flipped = !this.flipped;

      if (typeof callback === "function") callback();
    })
  }

  public onDragStart(event: PointerEvent) {
    if (this.isLast && this._flipper.options.fill === "single") return;
    if (!this._flipper.bounceTimeout) {
      super.onDragStart(event);
    }
  }


  public onDragMove(event: PointerEvent) {
    event.stopPropagation();
    event.preventDefault();
    super.onDragMove(event);
    this.setAngle(this.getDynamicAngle());
  }


  public setAngle(angle: number) {
    this.applyTransformation({angle, scale: this.scale});
    this._angle = angle;

    if (this.isFirst || this.isLast) {
      this._flipper.root.dispatchEvent(new CustomEvent("flipper:page:angle", {
        detail: {
          angle: this._angle,
          page: this,
        },
      }))
    }

    if (this.shadow) this.shadow.style.opacity = 1 - Math.abs(90 - Math.abs(angle)) / 90  + '';
  }


  public onDragEnd(event: PointerEvent) {
    if (!this.coordDiff(this.options.direction)) {
      this.HTMLNode.dispatchEvent(new Event("draggable:click"));
    } else if (this.getAngle()) {
      this.returnBack();
    }
  }

  public getAngle(): number {
    return this.isHorisontal()
      ? this._getAngle(this.options.width, "x")
      : this._getAngle(this.options.height, "y");
  }

  public getDynamicAngle(): number {
    let angle = this.getAngle();

    if (this.flipped) {
      if (angle > -1) angle = -1;
      if (angle < -179) angle = -179;
    } else {
      if (angle < 1) angle = 1;
      if (angle > 179) angle = 179;
    }
    const rotor = {
      left: this.flipped ? -180 - angle : -1 * angle,
      up: this.flipped ? 180 + angle : angle,
    }
    return rotor[this.options.direction];
  }

  /**
   * if one end of radius is fixed, then X or Y difference
   * between start drag position and current will allow us to calculate and angle diff
   * @param   radius  radius to be rotated
   * @param   dir     needed direction of rotation
   * @return  provides an angle in grad
   */
  private _getAngle(radius: number, dir: "x" | "y"): number {
    const diff = this.coordinates.start[dir] - this.coordinates.current[dir];
    const angle = 90 * diff / this.scale / radius;

    if (!this._hoverAngle) return angle;

    const rotor = {
      left: angle - ((this.flipped ? 180 : 0) + this._hoverAngle),
      up: angle + (this.flipped ? - 180 + this._hoverAngle : this._hoverAngle),
    }
    return rotor[this.options.direction];
  }

  private onMouseEnter() {
    // TODO: this check looks ugly
    if (this.isLast && this._flipper.options.fill === "single") return;
    if (this._flipper.pages.some(p => p.isDragged)) return;

    if (this.isProcessing || !this.onTop || this.isDragged) return;
    this.subscribe("mouseleave", this.onMouseLeave.bind(this), {once: true});

    const tiltAngle = {
      left: this.flipped ? -180 + this.options.tilt : -1 * this.options.tilt,
      up: this.flipped ? 180 - this.options.tilt : this.options.tilt,
    }

    const stepFunc = (angle: number) => {
      if (this.options.hover) this._hoverAngle = angle;
      this.setAngle(angle);
    }

    animateByStep(
      this._angle,
      tiltAngle[this.options.direction],
      this.options.duration / 3,
      stepFunc
    ).then(() => {

    });
  }

  private onMouseLeave() {
    if (this.isProcessing || this.isDragged) return;
    this.returnBack();
  }

  private returnBack(callback?: () => void) {
    const returnAngle = {
      left: this.flipped ? -180: 0,
      up: this.flipped ? 180: 0,
    }
    const stepFunc = (angle: number) => {
      if (this.options.hover) this._hoverAngle = angle;
      this.setAngle(angle);
    }
    animateByStep(
      this._angle,
      returnAngle[this.options.direction],
      this.options.duration / 3,
      stepFunc
    ).then(() => {
      if (typeof callback === "function") callback();
    });
  }

  private createNode(opt: FlipperPageSetting, withOffset = false): HTMLDivElement {
    const pageNode = document.createElement("div");

    if (withOffset) {
      pageNode.style.height = opt.height - opt.offset[0] * 2 + "px";
      pageNode.style.width = opt.width - opt.offset[1] * (this._flipper.options.spread ? 1 : 2) + "px";
    } else {
      pageNode.style.height = opt.height + "px";
      pageNode.style.width = opt.width + "px";
    }

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
    Object.keys(this.sites).forEach((key: "front" | "back") => {
      this.sites[key] = this.createNode(this.options, true);
      this.sites[key].classList.add(this.cssKlasses[key]);
      this.sites[key].style.top = `${this.options.offset[0]}px`;
      this.sites[key].style.left = `${this._flipper.options.spread ? 0 : this.options.offset[1]}px`;
    });

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
    super.subscribeDrag();
  }

  private isLink(str: string): boolean {
    return /^https?:\/\//.test(str);
  }

  private applyStyles(node: HTMLElement, styles: {[key: string]: any}) {
    Object.assign(node.style, styles);
  }

  private isHorisontal() {
    return this.options.direction === "left";
  }

  private applyTransformation(tr: Transformation) {
    const allTransforms = [];
    if (tr.angle) allTransforms.push(`rotate${this.isHorisontal() ? "Y" : "X"}(${tr.angle}deg)`);
    if (tr.scale) allTransforms.push(`scale(${tr.scale})`);
    this.HTMLNode.style.transform = allTransforms.join(" ");
  }
}
