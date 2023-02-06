export class Adjustable {

  public root: HTMLDivElement;

  private _width: number;
  private _height: number;

  private _initials: {width: number, height: number} = {
    width: undefined,
    height: undefined,
  };

  get width() {
    return this._width;
  }

  public setWidth(value: number, keepProportion = false) {
    if (value < 0) return;
    if (!this._initials.width) this._initials.width = value;
    this._width = value;
    if (keepProportion) this._height = this._width / this.proportion;
  }

  get height() {
    return this._height;
  }

  public setHeight(value: number, keepProportion = false) {
    if (value < 0) return;
    if (!this._initials.height) this._initials.height = value;
    this._height = value;
    if (keepProportion) this._width = this._height * this.proportion;
  }

  public updateInitials(value: {width: number, height: number}) {
    this.proportion
    this._initials = value;
  }

  public get proportion() {
    const {width, height} = this._initials;
    if (!width || !height) return undefined;
    return width / height;
  }

  public get scale(): number {
    return this._width / this._initials.width;
  }
}
