/**
 * Describes page settings
 */
export interface FlipperPageSetting {
  klass: string,
  width: string,
  height: string,
  src?: string,
  html?: string,
}

/**
 * Descripes Common options for fliper instance
 */
export interface FlipperOptionsInterface {
  pages: Array<string>,
  fill: "both" | "single",
  // TODO: make directions
  direction: "up" | "right" | "down" | "left",
  page: {
    width: string,
    heigth: string,
  }
}
