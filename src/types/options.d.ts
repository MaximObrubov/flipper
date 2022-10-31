/**
 * Describes page settings
 */
export interface FlipperPageSetting {
  klass: string,
  width: string,
  height: string,
  shadow: boolean,
  duration: number,
  direction: Direction,
  hover?: boolean,
  src?: string,
  html?: string,
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
  page: {
    width: string,
    height: string,
    shadow: boolean,
    hover: boolean,
  }
}
