import { FlipperPage, FlipperPageSetting } from "./components/page.class";
import { FlipperOptionsInterface } from "./types/options"

export class Flipper {


  BASE_KLASS = "flipper";

  DEFAULT: FlipperOptionsInterface = {
    pages: [],
    direction: "left",
  };

  public pages: Array<FlipperPage>;

  private PAGE_KLASS = `${this.BASE_KLASS}__page`

  private root: HTMLDivElement;

  private options: FlipperOptionsInterface;

  constructor(node: HTMLDivElement, options: FlipperOptionsInterface) {
    this.options = { ...this.DEFAULT, ...options }
    this.root = node;
  }

  init() {
    this.createPages();
  }

  private createPages() {
    // TODO: check if node not empty;
    // if node already contains elements with PAGE_KLASS then ignore initialization from source
    // show allert in console when the options ignored
    const pageSetting: FlipperPageSetting = { klass: this.PAGE_KLASS };
    this.pages = this.options.pages.map((pSrc: string): FlipperPage => {
      this.isLink(pSrc)
        ? pageSetting.src = pSrc
        : pageSetting.html = pSrc;
      return new FlipperPage(this.root, pageSetting);
    });
  }

  private isLink(str: string): boolean {
    return /^https?:\/\//.test(str);
  }
}
