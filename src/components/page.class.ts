import { FlipperPageInterface } from "../types/page";
import { FlipperPageSetting } from "../types/options";

interface FlipperPageSites {
  front: HTMLDivElement, back: HTMLDivElement
}

export class FlipperPage implements FlipperPageInterface {

  public width: number;
  public height: number;
  public pageNode: HTMLDivElement;
  public cssKlasses: {[key: string]: string};
  public flipped: boolean = false;

  private sites: FlipperPageSites = { front: null, back: null};
  private options: FlipperPageSetting;
  private _zIndex: number;

  constructor(
    parent: HTMLElement,
    content: string | {front: string, back: string},
    options: FlipperPageSetting
  ) {
    if (!options.klass) throw new Error("CSS class should be passed to page component");
    this.options = options;

    this.cssKlasses = {
      flipped: `${options.klass}--flipped`,
      front: `${options.klass}--front`,
      back: `${options.klass}--back`,
      blank: `${options.klass}--blank`,
      // TODO: don't interact transition rotate with hover
      // transitioning: `${options.klass}--transitioning`,
    };

    this.pageNode = this.createNode(this.options);
    this.pageNode.classList.add(options.klass);
    this.addContent(content);
    // TODO: exclude hovers while flip transition
    // this.sanitizeTransitions();
    parent.appendChild(this.pageNode);
  }

  set zIndex(value: number) {
    this._zIndex = value;
    this.pageNode.style.zIndex = this._zIndex + '';
  }

  get zIndex() {
    return this._zIndex;
  }

  public flip() {
    this.pageNode.classList.toggle(this.cssKlasses.flipped);
    this.flipped = !this.flipped;
  }

  public subscribe(event: string, callback: () => void) {
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

  private isLink(str: string): boolean {
    return /^https?:\/\//.test(str);
  }

  private sanitizeTransitions() {
    this.pageNode.addEventListener("transitionstart", () => {
      this.pageNode.classList.add(this.cssKlasses.transitioning);
    });
    this.pageNode.addEventListener("transitionend", () => {
      this.pageNode.classList.remove(this.cssKlasses.transitioning);
    })
  }

}
