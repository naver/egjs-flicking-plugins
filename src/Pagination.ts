import Flicking, { Plugin } from "@egjs/flicking";

interface PaginationOptions {

}

/**
 * @memberof Flicking.Plugins
 */
class Pagination implements Plugin {
  /* Internal Values */
  private _flicking: Flicking | null = null;

  public init(flicking: Flicking): void {
    if (this._flicking) {
      this.destroy();
    }

    this._flicking = flicking;
  }

  public destroy(): void {
    const flicking = this._flicking;

    if (!flicking) {
      return;
    }

    this._flicking = null;
  }

  public update(): void {
    // DO-NOTHING
  }
}

export default Pagination;
