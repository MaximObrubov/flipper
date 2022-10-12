import { FlipperPageInterface } from "../types/page";
import { FlipperPageSetting } from "../types/options";

interface FlipperPageSites {
  front: HTMLDivElement, back: HTMLDivElement
}

export class FlipperPage implements FlipperPageInterface {

  public id: number;
  public width: number;
  public height: number;
  public pageNode: HTMLDivElement;
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
    if (!options.klass) throw new Error("CSS class should be passed to page component");
    this.options = options;
    this.id = id;
    this.pageNode = this.createNode(this.options);
    this.pageNode.classList.add(options.klass);
    if (options.shadow) this.pageNode.classList.add(this.cssKlasses.shadowed);
    this.addSubscriptions();
    this.addContent(content);
    parent.appendChild(this.pageNode);
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
    this.pageNode.style.zIndex = this._zIndex + '';
  }

  get zIndex() {
    return this._zIndex;
  }

  set isProcessing(value: boolean) {
    this._isProcessing = value;
    value
      ? this.pageNode.classList.add(this.cssKlasses.processing)
      : this.pageNode.classList.remove(this.cssKlasses.processing);
  }

  get isProcessing() {
    return this._isProcessing;
  }

  set onTop(value: boolean) {
    this._onTop = value;
    this.pageNode.classList.toggle(this.cssKlasses.top, value);
  }

  get onTop(): boolean {
    return this._onTop;
  }

  public flip(callback?: () => void) {
    this.clearHover();
    const removeProzessingKlass = (event: TransitionEvent) => {
      if (event.propertyName !== "transform") return;
      this.isProcessing = false;
      this.pageNode.removeEventListener("transitionend", removeProzessingKlass);
      if (typeof callback === "function") callback();
    }
    this.isProcessing = true;
    this.pageNode.addEventListener("transitionend", removeProzessingKlass);
    this.pageNode.classList.toggle(this.cssKlasses.flipped);
    this.flipped = !this.flipped;
  }

  private onMouseEnter() {
    if (this.isProcessing || !this.onTop) return;
    this.pageNode.classList.add(this.cssKlasses.hover)
  }

  private onMouseLeave() {
    if (this.isProcessing) return;
    this.clearHover();
  }

  private clearHover() {
    if (this.pageNode.classList.contains(this.cssKlasses.hover)) {
      this.pageNode.classList.remove(this.cssKlasses.hover)
    }
  }

  public subscribe(event: string, callback: (event: Event) => void) {
    this.pageNode.addEventListener(event, callback)
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
    // image.alt = "-- image loading broken --";
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

    this.pageNode.appendChild(this.sites.front);
    this.pageNode.appendChild(this.sites.back);
  }

  private fillNode(parent: HTMLDivElement, content: string) {
    this.isLink(content)
      ? this.addImage(parent, content)
      : parent.innerHTML = content;
  }

  private addSubscriptions() {
    if (this.options.hover) this.subscribe("mouseenter", this.onMouseEnter.bind(this));
    if (this.options.hover) this.subscribe("mouseleave", this.onMouseLeave.bind(this));
  }

  private isLink(str: string): boolean {
    return /^https?:\/\//.test(str);
  }

}
