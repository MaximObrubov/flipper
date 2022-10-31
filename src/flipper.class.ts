import { FlipperPage } from "./components/page.class";
import { Direction, FlipperOptionsInterface } from "./types/options";
import "./flipper.scss";

export class Flipper {

  BASE_KLASS = "flipper";

  DEFAULT: FlipperOptionsInterface = {
    pages: [],
    direction: "left",
    fill: "both",
    time: 800,
    page: {
      width: "30em",
      height: "30em",
      shadow: true,
      hover: true,
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

  private bounceTimeout: number | undefined;

  constructor(node: HTMLDivElement, options: FlipperOptionsInterface) {
    this.options = { ...this.DEFAULT, ...options }
    this.root = node;
  }

  init() {
    this.root.classList.add(this.BASE_KLASS);
    this.root.classList.add(`${this.BASE_KLASS}--direction-${this.options.direction}`);
    this.root.classList.add(`${this.BASE_KLASS}--fill-${this.options.fill}`);
    this.createPages();
    this.root.style.transitionDuration = this.options.time + 'ms';
    setTimeout(() => this.pages.forEach(page => page.transitionSwitcher()));
  }

  private createPages() {
    const HTMLPages = this.root.querySelectorAll(`.${this.PAGE_KLASS}`);
    const pageNodes = Array.from(HTMLPages).map(p => p.innerHTML);
    // NOTE: if inside root node there is a prepared html page nodes, then initiate flipper from HTMTL
    //       if no prepared HTML nodes inside the root node, then build content from options
    const source = this.composeContent(pageNodes.length ? pageNodes : this.options.pages);
    if (pageNodes.length) this.root.innerHTML = "";

    this.pages = source.reverse().map((pSrc: string, index: number): FlipperPage => {
      const page = new FlipperPage(index, this.root, pSrc, {
        klass: this.PAGE_KLASS,
        width: this.options.page.width,
        height: this.options.page.height,
        shadow: this.options.page.shadow,
        duration: this.options.time,
        direction: this.options.direction,
        hover: this.options.page.hover,
      });
      // page.subscribe("click", this.flipPage.bind(this, page));
      page.subscribe("click", this.onPageClick.bind(this, page));
      page.subscribe("draggable:end", this.onPageDragEnd.bind(this, page));
      this.piles.initial.push(page);
      return page;
    });

    this.checkPiles();
  }

  private onPageClick(page: FlipperPage, e: MouseEvent) {
    if (this.bounceTimeout) return;
    this.flipPage.call(this, page);
    this.bounceTimeout = window.setTimeout(() => {
      this.bounceTimeout = undefined;
    }, this.options.time / 2);
  }

  private onPageDragEnd(page: FlipperPage) {
    if ((page.flipped ? -1 : 1) * page.getAngle() >  90) this.flipPage(page);
  }

  private flipPage(page: FlipperPage) {
    if (!this.isTheTopOfThePile(page)) return;
    if (page === this.piles.initial[0] && this.options.fill === "single") return;
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
    this.checkPiles();
  }

  private composeContent(pagesSource: Array<any>) {
    if (this.options.fill === "single") return pagesSource;
    let lastPage: { front: string, back: string } = {front: null, back: null};
    const pages = pagesSource.reduce((pages, content, i) => {
      if (i % 2 == 0) {
        lastPage.front = content;
      } else {
        lastPage.back = content;
        pages.push(lastPage);
        lastPage = {front: null, back: null};
      }
      return pages;
    }, []);
    if (lastPage.front) pages.push(lastPage);
    return pages;
  }

  /**
   * If page is not on the top of the flipped or initian piles then it should stay intact
   * @param page - FlipperPage to be checked
   */
  private isTheTopOfThePile(page: FlipperPage) {
    if (page.flipped && page == this.piles.flipped.slice(-1)[0]) return true;
    if (!page.flipped && page == this.piles.initial.slice(-1)[0]) return true;
    return false;
  }

  private resetPileTops() {
    this.pages.forEach(p => { p.onTop = this.isTheTopOfThePile(p); });
  }

  private checkPiles() {
    const closedKlass = this.BASE_KLASS + "--closed";
    const flippedKlass = this.BASE_KLASS + "--flipped";

    this.resetPileTops();

    if (!this.piles.flipped.length) {
      this.root.classList.add(closedKlass);
      this.adjustRoot(true);
      this.resetZIndex(true);
    } else if (!this.piles.initial.length) {
      this.root.classList.add(closedKlass);
      this.root.classList.add(flippedKlass);
      this.adjustRoot(true);
      this.resetZIndex(false);
    } else {
      this.root.classList.remove(flippedKlass);
      this.root.classList.remove(closedKlass);
      this.adjustRoot();
    }
  }

  private resetZIndex(reverse: boolean) {
    const len = this.pages.length;
    this.pages.forEach((p, i) => p.zIndex = reverse ? i + 1 : len - i);
    this.maxZIndex = len;
  }

  private adjustRoot(closed = false) {
    const double = (val: string) => val.replace(/^(\d+)(.+)$/, (_, val, unit) => {
      return parseInt(val) * (this.options.fill === "both" ? 2 : 1.1) + unit;
    });
    const direction: {[key in Direction]: () => void} = {
      left: () => {
        this.root.style.width = closed ? this.options.page.width : double(this.options.page.width);
        this.root.style.height = this.options.page.height;
      },
      up: () => {
        this.root.style.height = closed ? this.options.page.height : double(this.options.page.height);
        this.root.style.width = this.options.page.width;
      }
    }
    direction[this.options.direction]();
  }

}
