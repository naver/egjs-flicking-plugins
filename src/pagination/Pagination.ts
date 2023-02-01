import Flicking, { EVENTS, Plugin } from "@egjs/flicking";

import { PAGINATION } from "../const";
import ScrollContext from "../type";

import Renderer from "./renderer/Renderer";
import BulletRenderer from "./renderer/BulletRenderer";
import FractionRenderer from "./renderer/FractionRenderer";
import ScrollBulletRenderer from "./renderer/ScrollBulletRenderer";

export interface PaginationOptions {
  parentEl: HTMLElement | null;
  selector: string;
  type: "bullet" | "fraction" | "scroll";
  classPrefix: string;
  bulletCount: number;
  renderBullet: (className: string, index: number) => string;
  renderFraction: (currentClass: string, totalClass: string) => string;
  renderActiveBullet: ((className: string, index: number) => string) | null;
  fractionCurrentFormat: (index: number) => string;
  fractionTotalFormat: (total: number) => string;
  scrollOnChange: (index: number, ctx: ScrollContext) => any;
}

/**
 * @memberof Flicking.Plugins
 */
class Pagination implements Plugin {
  /* Internal Values */
  private _flicking: Flicking | null = null;
  private _renderer: Renderer;
  private _wrapper: HTMLElement;

  /* Options */
  private _parentEl: PaginationOptions["parentEl"];
  private _selector: PaginationOptions["selector"];
  private _type: PaginationOptions["type"];
  private _classPrefix: PaginationOptions["classPrefix"];
  private _bulletCount: PaginationOptions["bulletCount"];
  private _renderBullet: PaginationOptions["renderBullet"];
  private _renderActiveBullet: PaginationOptions["renderActiveBullet"];
  private _renderFraction: PaginationOptions["renderFraction"];
  private _fractionCurrentFormat: PaginationOptions["fractionCurrentFormat"];
  private _fractionTotalFormat: PaginationOptions["fractionTotalFormat"];
  private _scrollOnChange: PaginationOptions["scrollOnChange"];

  public get parentEl() { return this._parentEl; }
  public get selector() { return this._selector; }
  public get type() { return this._type; }
  public get classPrefix() { return this._classPrefix; }
  public get bulletCount() { return this._bulletCount; }
  public get renderBullet() { return this._renderBullet; }
  public get renderActiveBullet() { return this._renderActiveBullet; }
  public get renderFraction() { return this._renderFraction; }
  public get fractionCurrentFormat() { return this._fractionCurrentFormat; }
  public get fractionTotalFormat() { return this._fractionTotalFormat; }
  public get scrollOnChange() { return this._scrollOnChange; }

  public set parentEl(val: PaginationOptions["parentEl"]) { this._parentEl = val; }
  public set selector(val: PaginationOptions["selector"]) { this._selector = val; }
  public set type(val: PaginationOptions["type"]) { this._type = val; }
  public set bulletWrapperclassPrefixClass(val: PaginationOptions["classPrefix"]) { this._classPrefix = val; }
  public set bulletCount(val: PaginationOptions["bulletCount"]) { this._bulletCount = val; }
  public set renderBullet(val: PaginationOptions["renderBullet"]) { this._renderBullet = val; }
  public set renderActiveBullet(val: PaginationOptions["renderActiveBullet"]) { this._renderActiveBullet = val; }
  public set renderFraction(val: PaginationOptions["renderFraction"]) { this._renderFraction = val; }
  public set fractionCurrentFormat(val: PaginationOptions["fractionCurrentFormat"]) { this._fractionCurrentFormat = val; }
  public set fractionTotalFormat(val: PaginationOptions["fractionTotalFormat"]) { this._fractionTotalFormat = val; }
  public set scrollOnChange(val: PaginationOptions["scrollOnChange"]) { this._scrollOnChange = val; }

  public constructor({
    parentEl = null,
    selector = PAGINATION.SELECTOR,
    type = PAGINATION.TYPE.BULLET,
    classPrefix = PAGINATION.PREFIX,
    bulletCount = 5,
    renderBullet = (className: string) => `<span class="${className}"></span>`,
    renderActiveBullet = null,
    renderFraction = (currentClass: string, totalClass: string) => `<span class="${currentClass}"></span>/<span class="${totalClass}"></span>`,
    fractionCurrentFormat = (index: number) => index.toString(),
    fractionTotalFormat = (index: number) => index.toString(),
    scrollOnChange = (index: number, ctx: ScrollContext) => ctx.moveTo(index)
  }: Partial<PaginationOptions> = {}) {
    this._parentEl = parentEl;
    this._selector = selector;
    this._type = type;
    this._classPrefix = classPrefix;
    this._bulletCount = bulletCount;
    this._renderBullet = renderBullet;
    this._renderActiveBullet = renderActiveBullet;
    this._renderFraction = renderFraction;
    this._fractionCurrentFormat = fractionCurrentFormat;
    this._fractionTotalFormat = fractionTotalFormat;
    this._scrollOnChange = scrollOnChange;
  }

  public init(flicking: Flicking): void {
    if (this._flicking) {
      this.destroy();
    }

    this._flicking = flicking;

    const type = this._type;
    const selector = this._selector;
    const parentEl = this._parentEl ? this._parentEl : flicking.element;
    const wrapper = parentEl.querySelector(selector);

    if (!wrapper) {
      throw new Error(`[Flicking-Pagination] Couldn't find element with the given selector: ${selector}`);
    }

    this._wrapper = wrapper as HTMLElement;
    this._renderer = this._createRenderer(type);

    flicking.on(EVENTS.WILL_CHANGE, this._onIndexChange);
    flicking.on(EVENTS.WILL_RESTORE, this._onIndexChange);
    flicking.on(EVENTS.PANEL_CHANGE, this.update);

    this.update();
  }

  public destroy(): void {
    const flicking = this._flicking;

    if (!flicking) {
      return;
    }

    flicking.off(EVENTS.WILL_CHANGE, this._onIndexChange);
    flicking.off(EVENTS.WILL_RESTORE, this._onIndexChange);
    flicking.off(EVENTS.PANEL_CHANGE, this.update);

    this._renderer.destroy();
    this._removeAllChilds();
    this._flicking = null;
  }

  public update = (): void => {
    this._removeAllChilds();
    this._renderer.render();
  };

  private _createRenderer(type: PaginationOptions["type"]) {
    const options = {
      flicking: this._flicking!,
      pagination: this,
      wrapper: this._wrapper
    };

    switch (type) {
      case PAGINATION.TYPE.BULLET:
        return new BulletRenderer(options);
      case PAGINATION.TYPE.FRACTION:
        return new FractionRenderer(options);
      case PAGINATION.TYPE.SCROLL:
        return new ScrollBulletRenderer(options);
      default:
        throw new Error(`[Flicking-Pagination] type "${type}" is not supported.`);
    }
  }

  private _onIndexChange = (evt: { index: number }) => {
    this._renderer.update(evt.index);
  };

  private _removeAllChilds() {
    const wrapper = this._wrapper;

    while (wrapper.firstChild) {
      wrapper.removeChild(wrapper.firstChild);
    }
  }
}

export default Pagination;
