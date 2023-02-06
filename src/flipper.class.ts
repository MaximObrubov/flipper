import { FlipperPage } from "./components/page.class";
import { Adjustable } from "./components/adjustable.class";
import { Direction, FlipperOptionsInterface } from "./types/options";
import defaultOptions from "./default.config";
import "./flipper.scss";

export class Flipper extends Adjustable {

  BASE_KLASS = "flipper";

  DEFAULT: FlipperOptionsInterface = defaultOptions;

  public pages: Array<FlipperPage>;

  private piles: {flipped: Array<FlipperPage>, initial: Array<FlipperPage>} = {
    flipped: [],
    initial: []
  }

  public options: FlipperOptionsInterface;

  private PAGE_KLASS = `${this.BASE_KLASS}__page`

  private flipped: boolean = false;

  public bounceTimeout: number | undefined;

  // TODO: ugly logic with maxZid, remaster it
  private maxZIndex = 0;

  public isTouch: boolean = false;

  private inner: HTMLDivElement;

  constructor(node: HTMLDivElement, options: FlipperOptionsInterface) {
    super();
    this.root = node;
    this.isTouch = ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      // @ts-ignore
      (navigator.msMaxTouchPoints > 0);
    this.fillOptions(options);
  }

  init() {
    this.root.classList.add(this.BASE_KLASS);
    this.root.classList.add(`${this.BASE_KLASS}--direction-${this.options.direction}`);
    this.root.classList.add(`${this.BASE_KLASS}--fill-${this.options.fill}`);
    if (this.options.page.shadow) this.root.classList.add(`${this.BASE_KLASS}--shadowed`);
    this.addInner();
    this.createPages();

    // NOTE: subscriptions
    this.waitImgLoad();
    if (this.options.adaptive) this.watchParentSize();
    this.root.addEventListener("flipper:update", (ev: CustomEvent) => {
      this.reinit(ev.detail);
    });

    if (this.options.fill === "both") {
      this.root.addEventListener("flipper:page:angle", this.onPageAngle.bind(this)) ;
    }
  }

  public reinit(options?: FlipperOptionsInterface) {
    if (options) this.fillOptions(options);
    const {width, height} = this.options.page;
    this.updateInitials({width, height});
    this.piles = {flipped: [], initial: []};

    this.inner.innerHTML = "";
    this.createPages();
    this.checkPiles();
    this.waitImgLoad();
    // this.adjust(true);
  }

  /**
   * rotates nex page forth. Do nothing if there is no nex pages
   */
  public next(): void {
    this.rotatePage("forth");
  }

  /**
   * rotates pages back. Do nothing if there is no flipped pages
   */
  public prev(): void {
    this.rotatePage("back");
  }

  /**
   * privdes a data of flipped and total amount of pages
   */
  public get pagesCount(): {flipped: number, all: number} {
    return { flipped: this.piles.flipped.length, all: this.pages.length };
  }


  private rotatePage(direction: "forth" | "back") {
    if (this.bounceTimeout) return;
    const pile = direction === "back" ? this.piles.flipped : this.piles.initial;
    const page = pile.slice(-1)[0];
    if (!page) return;
    if (page.isProcessing) return;
    this.flipPage(page);

    this.setDebounceTimeout();
  }

  private addInner() {
    this.inner = document.createElement("div");
    this.inner.classList.add(`${this.BASE_KLASS}__inner`);
    this.inner.style.perspective = this.options.perspective + "px";
  }

  private fillOptions(options: FlipperOptionsInterface) {
    if (!this.options) {
      this.options = {
        ...this.DEFAULT,
        ...options,
        page: {
          ...this.DEFAULT.page,
          ...options.page
        }
      };
    } else {
      this.options = {
        ...this.options,
        ...options,
        page: {
          ...this.options.page,
          ...options.page
        }
      };
    }
    // NOTE: force no hover on mobile devices
    if (this.isTouch) this.options.page.hover = false;
    this.setWidth(this.options.page.width);
    this.setHeight(this.options.page.height);
  }

  private createPages() {
    const HTMLPages = this.root.querySelectorAll(`.${this.PAGE_KLASS}`);
    const pageNodes = Array.from(HTMLPages).map(p => p.innerHTML);
    // NOTE: if inside root node there is a prepared html page nodes, then initiate flipper from HTMTL
    //       if no prepared HTML nodes inside the root node, then build content from options
    const source = this.composeContent(pageNodes.length ? pageNodes : this.options.pages);
    if (pageNodes.length) this.root.innerHTML = "";

    this.root.appendChild(this.inner);
    this.pages = source.reverse().map((pSrc: string, index: number): FlipperPage => {
      const page = new FlipperPage(index, this, this.inner, pSrc, {
        klass: this.PAGE_KLASS,
        width: this.options.page.width,
        height: this.options.page.height,
        shadow: this.options.page.shadow,
        duration: this.options.time,
        tilt: this.options.page.tilt || 25,
        direction: this.options.direction,
        hover: this.options.page.hover,
        offset: this.options.page.offset,
      });
      const isLast = index === 0;
      const isFirst = index === source.length - 1;
      page.subscribe("draggable:click", this.onPageClick.bind(this, page));
      page.subscribe("draggable:end", this.onPageDragEnd.bind(this, page));
      page.isLast = isLast;
      page.isFirst = isFirst;
      this.piles.initial.push(page);
      return page;
    });

    this.checkPiles();
  }

  private waitImgLoad() {
    const images = Array.from(this.root.querySelectorAll("img"));
    const promises = images.map(i => {
      return new Promise((res, rej) => {
        i.onload = res;
        i.onerror = rej;
      });
    });
    Promise.allSettled(promises).then(() => {
      this.emit("loaded", { images })
    });
  }

  private emit(eventName: string, data: {[key: string]: any}) {
    type FlipperEvent = { flipper: Flipper, data: {[key: string]: any}};
    document.dispatchEvent(new CustomEvent<FlipperEvent>(
      `flipper:${eventName}`,
      { detail: {flipper: this, data} }
    ));
  }

  private onPageClick(page: FlipperPage, e: MouseEvent) {
    if (this.bounceTimeout) return;
    this.flipPage.call(this, page);
    this.setDebounceTimeout();
  }

  private onPageAngle(ev: CustomEvent) {
    const { page, angle } = ev.detail;
    const firstPageOpens = (this.piles.flipped.length === 0 && ev.detail.page === this.piles.initial[this.piles.initial.length -1]);
    const firstPageCloses = (this.piles.flipped.length === 1 && ev.detail.page === this.piles.flipped[0]);

    const lastPageCloses = ((this.piles.flipped.length === this.pages.length - 1) && page === this.piles.initial[0]);
    const lastPageOpens = ((this.piles.flipped.length === this.pages.length) && page === this.piles.flipped[this.piles.flipped.length -1]);
    let size = this.options.direction === "left" ? this.options.page.width : this.options.page.height;

    // if (this.options.fill === "single") size = this.options.singleFilledOffset;

    if (firstPageCloses || firstPageOpens) {
      let toAdd: string | number = size * Math.cos((180 + angle) / 180 * Math.PI) * this.scale;
      toAdd = `${Math.min(toAdd > 0 ? toAdd : 0, size)}px`;
      this.options.direction === "left"
        ? this.root.style.paddingLeft = toAdd
        : this.root.style.paddingTop = toAdd;
    }

    if (lastPageCloses || lastPageOpens) {
      let toAdd: string | number = size * Math.cos(-angle / 180 * Math.PI) * this.scale;
      toAdd = `${Math.min(toAdd > 0 ? toAdd : 0, size)}px`;
      this.options.direction === "left"
        ? this.root.style.width = toAdd
        : this.root.style.height = toAdd;
    }
  }


  private setDebounceTimeout() {
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

    page.zIndex = this.maxZIndex + 1;
    this.maxZIndex = page.zIndex;

    if (page.flipped) {
      this.piles.initial.push(page)
      this.piles.flipped.pop();
    } else {
      this.piles.flipped.push(page)
      this.piles.initial.pop();
    }
    this.checkPiles();
    page.flip();
    this.emit("flipped", this.pagesCount);
  }

  private composeContent(pagesSource: Array<any>) {
    // NOTE: reverce page site stays blank
    if (this.options.fill === "single") return pagesSource;

    let page: { front: string, back: string } = {front: null, back: null};
    let back: string;

    const pages = pagesSource.reduce((_pages, content, i) => {
      if (this.isLink(content)) content = this.generateImageNode(content).outerHTML;
      if (this.options.spread) {
        // NOTE: passed pages content is already a book spread,
        // in this case passed content should cover two page sites
        if (!i) {
          page.front = this.wrapInHalfer(content, false);
          back = this.wrapInHalfer(content, true);
        } else {
          page.back = this.wrapInHalfer(content, true);
          _pages.push(page);
          page = {front: this.wrapInHalfer(content, false), back};
        }
      } else {
        // NOTE: page consists of two sites
        // every passed pages parameter applies to every site
        if (i % 2 == 0) {
          page.front = content;
        } else {
          page.back = content;
          _pages.push(page);
          page = {front: null, back: null};
        }
      }
      return _pages;
    }, []);

    if (page.front) pages.push(page);
    return pages;
  }

  private wrapInHalfer(content: string, isOdd: boolean) {
    const wrapper = document.createElement("div");
    const klass = this.BASE_KLASS + "__page-halfer";
    wrapper.classList.add(klass, klass + (isOdd ? "--odd" : "--even"));
    wrapper.innerHTML = content;
    return wrapper.outerHTML;
  }

  /**
   * If page is not on the top of the flipped or initian piles then it should stay intact
   * @param page - FlipperPage to be checked
   */
  private isTheTopOfThePile(page: FlipperPage) {
    if (page == this.piles.flipped.slice(-1)[0]) return true;
    if (page == this.piles.initial.slice(-1)[0]) return true;
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
      this.flipped = false;
      this.adjust(true);
      this.resetZIndex(true);
    } else if (!this.piles.initial.length) {
      this.root.classList.add(closedKlass);
      this.root.classList.add(flippedKlass);
      this.flipped = true;
      this.adjust(true);
      this.resetZIndex(false);
    } else {
      this.root.classList.remove(flippedKlass);
      this.flipped = false;
      this.root.classList.remove(closedKlass);
      // this.adjust();
    }
  }

  private resetZIndex(reverse: boolean) {
    const len = this.pages.length;
    this.pages.forEach((p, i) => p.zIndex = reverse ? i + 1 : len - i);
    this.maxZIndex = len;
  }

  private adjust(closed = false) {
    const direction: {[key in Direction]: () => void} = {
      left: () => {
        if (closed) {
          if (this.flipped) {
            this.root.style.paddingLeft = this.width + "px";
            this.root.style.width = "0px";
          } else {
            this.root.style.paddingLeft = "0px";
            this.root.style.width = this.width + "px";
          }
        } else {
          // this.root.style.paddingLeft = this.options.fill === "single"
          //   ? this.options.singleFilledOffset + "px"
          //   : this.width + "px";
          this.root.style.paddingLeft = this.width + "px";
          this.root.style.width = this.width + "px";
        }
        this.root.style.height = this.height + "px";
      },
      up: () => {
        if (closed) {
          if (this.flipped) {
            this.root.style.paddingTop = this.height + "px";
            this.root.style.height = "0";
          } else {
            this.root.style.paddingTop = "0";
            this.root.style.height = this.height + "px";
          }
        } else {
          // this.root.style.paddingTop = this.options.fill === "single"
          //   ? this.options.singleFilledOffset + "px"
          //   : this.height + "px";
          this.root.style.height = this.height + "px";
          this.root.style.paddingTop = this.height + "px";
        }
        this.root.style.width = this.width + "px";
      }
    }
    direction[this.options.direction]();
  }

  private isLink(str: string): boolean {
    return /^https?:\/\//.test(str);
  }

  private generateImageNode(src: string) {
    const imageNode = document.createElement("img");
    imageNode.src = src;
    return imageNode;
  }

  private watchParentSize() {
    // const observer = new ResizeObserver(debounce((check: Array<ResizeObserverEntry>) => {
    const observer = new ResizeObserver((check: Array<ResizeObserverEntry>) => {
      const parentWidth = check[0]?.contentBoxSize[0]?.inlineSize;
      const limit = this.options.page.width * (this.options.direction === "left" ? 2 : 1);

      if (parentWidth < limit) {
        this.setWidth(parentWidth / 2, true);
        this.adjust(this.piles.flipped.length === 0);
        this.pages.forEach(p => p.scale = this.scale );
      }
    });
    // }));
    observer.observe(this.root.parentElement);
  }
}
