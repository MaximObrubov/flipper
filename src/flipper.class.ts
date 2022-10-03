import { FlipperPage } from "./components/page.class";
import { FlipperOptionsInterface } from "./types/options";
import "./flipper.scss";

export class Flipper {


  BASE_KLASS = "flipper";

  DEFAULT: FlipperOptionsInterface = {
    pages: [],
    direction: "left",
    fill: "both",
    page: {
      width: "30em",
      heigth: "30em",
    }
  };

  public pages: Array<FlipperPage>;

  private piles: {flipped: Array<FlipperPage>, initial: Array<FlipperPage>} = {
    flipped: [],
    initial: []
  }

  private PAGE_KLASS = `${this.BASE_KLASS}__page`

  private root: HTMLDivElement;

  private options: FlipperOptionsInterface;

  // TODO: ugly logic with maxZid, remaster it
  private maxZIndex = 0;

  constructor(node: HTMLDivElement, options: FlipperOptionsInterface) {
    this.options = { ...this.DEFAULT, ...options }
    this.root = node;
  }

  init() {
    this.root.classList.add(this.BASE_KLASS);
    this.adjustRoot();
    this.createPages();
  }

  private createPages() {
    // TODO: check if node not empty;
    // if node already contains elements with PAGE_KLASS then ignore initialization from source
    // show allert in console when the options ignored
    const source = this.composeContent();
    this.pages = source.reverse().map((pSrc: string, index: number): FlipperPage => {
      const page = new FlipperPage(this.root, pSrc, {
        klass: this.PAGE_KLASS,
        width: this.options.page.width,
        height: this.options.page.heigth,
      });
      // page.zIndex = index + 1;
      page.subscribe("click", this.flipPage.bind(this, page));
      this.piles.initial.push(page);
      // if (page.zIndex > this.maxZIndex) this.maxZIndex = page.zIndex;
      return page;
    });
  }

  private flipPage(page: FlipperPage) {
    if (page.flipped && page !== this.piles.flipped.slice(-1)[0]) return;
    if (!page.flipped && page !== this.piles.initial.slice(-1)[0]) return;

    page.flip();
    page.zIndex = this.maxZIndex + 1;
    this.maxZIndex = page.zIndex;

    if (page.flipped) {
      this.piles.flipped.push(page)
      this.piles.initial.pop();
    } else {
      this.piles.initial.push(page)
      this.piles.flipped.pop();
    }
  }

  private composeContent() {
    if (this.options.fill === "single") return this.options.pages;
    // NOTE: both fill case
    let lastPage: { front: string, back: string } = {front: null, back: null};
    const pages = this.options.pages.reduce((pages, content, i) => {
      if (i % 2 == 0) {
        lastPage.front = content;
      } else {
        lastPage.back = content;
        pages.push(lastPage);
        lastPage = {front: null, back: null};
      }
      return pages;
    }, []);
    return pages;
  }

  private adjustRoot() {
    // NOTE: should be corelated with direction options
    // for "left" direction, main node should have double width
    this.root.style.width = this.options.page.width.replace(/^(\d+)(.+)$/, (_, val, unit) => {
      return parseInt(val) * 2 + unit;
    });
    this.root.style.height = this.options.page.heigth;
  }

}
