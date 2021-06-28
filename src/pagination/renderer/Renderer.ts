import Flicking from "@egjs/flicking";

import Pagination from "../Pagination";

export interface RendererOptions {
  flicking: Flicking;
  pagination: Pagination;
  wrapper: HTMLElement;
}

abstract class Renderer {
  protected _flicking: Flicking;
  protected _pagination: Pagination;
  protected _wrapper: HTMLElement;

  public constructor({
    flicking,
    pagination,
    wrapper
  }: RendererOptions) {
    this._flicking = flicking;
    this._pagination = pagination;
    this._wrapper = wrapper;
  }

  public abstract render(): void;
  public abstract update(index: number): void;
}

export default Renderer;
