import { FlipperPageInterface } from "../types/page";

export interface FlipperPageSetting {
  klass: string, src?: string, html?: string
};

export class FlipperPage implements FlipperPageInterface {

  public width: number;
  public height: number;

  private pageNode: HTMLDivElement;
  private imageNode?: HTMLImageElement;

  constructor(parent: HTMLElement, options: FlipperPageSetting) {
    this.pageNode = document.createElement("div");
    if (options.html) this.pageNode.innerHTML = options.html;
    if (options.src) this.addImage(options.src);
    this.pageNode.classList.add(options.klass);
    parent.appendChild(this.pageNode);
  }

  private addImage(src: string) {
    this.imageNode = this.generateImageNode(src);
    this.pageNode.appendChild(this.imageNode);
  }

  private generateImageNode(src: string) {
    const imageNode = document.createElement("img");
    // image.alt = "-- image loading broken --";
    imageNode.src = src;
    return imageNode;
  }

}
