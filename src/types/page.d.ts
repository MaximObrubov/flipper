/**
 * Describes a Flipper page properties
 */
export interface FlipperPageInterface {
  width: number,
  height: number,

  /**
   * page content if passed as raw HTML
   */
  content?: string,

  /**
   * Page content if page only contains one picture
   */
  src?: string,
}
