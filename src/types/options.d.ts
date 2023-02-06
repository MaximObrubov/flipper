/**
 * Describes page settings
 */
export interface FlipperPageSetting {
  klass: string,
  width: number,
  height: number,
  shadow: boolean,
  duration: number,
  tilt: number,
  direction: Direction,
  hover?: boolean,
  src?: string,
  html?: string,
  offset: [number, number]
}

export type Direction = "up" | "left"

/**
 * Descripes Common options for fliper instance
 */
export interface FlipperOptionsInterface {
  pages: Array<string>,
  fill: "both" | "single",
  direction: Direction,
  time: number,

  /**
   * defines if 1 passed page should be devided to 2 flipper sites
   */
  spread: boolean,
  adaptive: boolean,
  perspective: number,
  singleFilledOffset: number,
  page: {
    width: number,
    height: number,
    shadow: boolean,
    hover: boolean,
    tilt?: number,
    offset: [number, number]
  }
}
