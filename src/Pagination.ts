import Flicking, { ChangedEvent, EVENTS, FlickingError, Plugin } from "@egjs/flicking";

import { PAGINATION } from "./const";
import { addClass, removeClass } from "./utils";

interface PaginationOptions {
  parentEl: HTMLElement | null;
  selector: string;
  type: "bullet" | "fraction";
  bulletClass: string;
  bulletActiveClass: string;
  fractionCurrentClass: string;
  fractionTotalClass: string;
  renderBullet: (className: string, index: number) => string;
  renderFraction: (currentClass: string, totalClass: string) => string;
  fractionCurrentFormat: (index: number) => string;
  fractionTotalFormat: (total: number) => string;
}

/**
 * @memberof Flicking.Plugins
 */
class Pagination implements Plugin {
  /* Internal Values */
  private _flicking: Flicking | null = null;
  private _wrapper: HTMLElement;
  private _childs: HTMLElement[];

  /* Options */
  private _parentEl: PaginationOptions["parentEl"];
  private _selector: PaginationOptions["selector"];
  private _type: PaginationOptions["type"];
  private _bulletClass: PaginationOptions["bulletClass"];
  private _bulletActiveClass: PaginationOptions["bulletActiveClass"];
  private _renderBullet: PaginationOptions["renderBullet"];
  private _fractionCurrentClass: PaginationOptions["fractionCurrentClass"];
  private _fractionTotalClass: PaginationOptions["fractionTotalClass"];
  private _renderFraction: PaginationOptions["renderFraction"];
  private _fractionCurrentFormat: PaginationOptions["fractionCurrentFormat"];
  private _fractionTotalFormat: PaginationOptions["fractionTotalFormat"];

  public get parentEl() { return this._parentEl; }
  public get selector() { return this._selector; }
  public get type() { return this._type; }
  public get bulletClass() { return this._bulletClass; }
  public get bulletActiveClass() { return this._bulletActiveClass; }
  public get renderBullet() { return this._renderBullet; }
  public get fractionCurrentClass() { return this._fractionCurrentClass; }
  public get fractionTotalClass() { return this._fractionTotalClass; }
  public get renderFraction() { return this._renderFraction; }
  public get fractionCurrentFormat() { return this._fractionCurrentFormat; }
  public get fractionTotalFormat() { return this._fractionTotalFormat; }

  public set parentEl(val: PaginationOptions["parentEl"]) { this._parentEl = val; }
  public set selector(val: PaginationOptions["selector"]) { this._selector = val; }
  public set type(val: PaginationOptions["type"]) { this._type = val; }
  public set bulletClass(val: PaginationOptions["bulletClass"]) { this._bulletClass = val; }
  public set bulletActiveClass(val: PaginationOptions["bulletActiveClass"]) { this._bulletActiveClass = val; }
  public set renderBullet(val: PaginationOptions["renderBullet"]) { this._renderBullet = val; }
  public set fractionCurrentClass(val: PaginationOptions["fractionCurrentClass"]) { this._fractionCurrentClass = val; }
  public set fractionTotalClass(val: PaginationOptions["fractionTotalClass"]) { this._fractionTotalClass = val; }
  public set renderFraction(val: PaginationOptions["renderFraction"]) { this._renderFraction = val; }
  public set fractionCurrentFormat(val: PaginationOptions["fractionCurrentFormat"]) { this._fractionCurrentFormat = val; }
  public set fractionTotalFormat(val: PaginationOptions["fractionTotalFormat"]) { this._fractionTotalFormat = val; }

  public constructor({
    parentEl = null,
    selector = PAGINATION.SELECTOR,
    type = PAGINATION.TYPE.BULLET,
    bulletClass = PAGINATION.BULLET_CLASS,
    bulletActiveClass = PAGINATION.BULLET_ACTIVE_CLASS,
    renderBullet = (className: string) => `<span class="${className}"></span>`,
    fractionCurrentClass = PAGINATION.FRACTION_CURRENT_CLASS,
    fractionTotalClass = PAGINATION.FRACTION_TOTAL_CLASS,
    renderFraction = (currentClass: string, totalClass: string) => `<span class="${currentClass}"></span>/<span class="${totalClass}"></span>`,
    fractionCurrentFormat = (index: number) => index.toString(),
    fractionTotalFormat = (index: number) => index.toString()
  }: Partial<PaginationOptions> = {}) {
    this._parentEl = parentEl;
    this._selector = selector;
    this._type = type;
    this._bulletClass = bulletClass;
    this._bulletActiveClass = bulletActiveClass;
    this._renderBullet = renderBullet;
    this._fractionCurrentClass = fractionCurrentClass;
    this._fractionTotalClass = fractionTotalClass;
    this._renderFraction = renderFraction;
    this._fractionCurrentFormat = fractionCurrentFormat;
    this._fractionTotalFormat = fractionTotalFormat;
    this._childs = [];
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

    if (type === PAGINATION.TYPE.BULLET) {
      flicking.on(EVENTS.CHANGED, this._onBulletChanged);
    } else if (type === PAGINATION.TYPE.FRACTION) {
      flicking.on(EVENTS.CHANGED, this._onFractionChanged);
    }

    this.update();
  }

  public destroy(): void {
    const flicking = this._flicking;
    const type = this._type;

    if (!flicking) {
      return;
    }

    if (type === PAGINATION.TYPE.BULLET) {
      flicking.off(EVENTS.CHANGED, this._onBulletChanged);
    } else if (type === PAGINATION.TYPE.FRACTION) {
      flicking.off(EVENTS.CHANGED, this._onFractionChanged);
    }

    this._removeAllChilds();

    this._flicking = null;
  }

  public update(): void {
    const type = this._type;

    if (type === PAGINATION.TYPE.BULLET) {
      this._renderBullets();
    } else if (type === PAGINATION.TYPE.FRACTION) {
      this._renderFractions();
    }
  }

  private _renderBullets() {
    const flicking = this._flicking!;
    const anchorPoints = flicking.camera.anchorPoints;
    const wrapper = this._wrapper;

    this._removeAllChilds();

    wrapper.innerHTML = anchorPoints
      .map((_, index) => this._renderBullet(this._bulletClass, index))
      .join("\n");

    const bullets = [].slice.call(wrapper.children) as HTMLElement[];

    bullets.forEach((bullet, index) => {
      const anchorPoint = anchorPoints[index];

      if (anchorPoint.index === flicking.index) {
        addClass(bullet, this._bulletActiveClass);
      }

      bullet.addEventListener("mousedown", e => {
        e.stopPropagation();
      });

      bullet.addEventListener("touchstart", e => {
        e.stopPropagation();
      });

      bullet.addEventListener("click", () => {
        flicking.moveTo(anchorPoint.panel.index)
          .catch(err => {
            if (err instanceof FlickingError) return;
            throw err;
          });
      });
    });

    this._childs = bullets;
  }

  private _renderFractions() {
    const wrapper = this._wrapper;

    this._removeAllChilds();

    wrapper.innerHTML = this._renderFraction(this._fractionCurrentClass, this._fractionTotalClass);

    this._onFractionChanged();
  }

  private _onBulletChanged = (evt: ChangedEvent) => {
    const flicking = this._flicking!;
    const bullets = this._childs;
    const anchorPoints = flicking.camera.anchorPoints;

    if (anchorPoints.length <= 0) return;

    const anchorOffset = anchorPoints[0].panel.index;

    const activeBullet = bullets[evt.index + anchorOffset];
    const prevActiveBullet = bullets[evt.prevIndex + anchorOffset];

    addClass(activeBullet, PAGINATION.BULLET_ACTIVE_CLASS);
    removeClass(prevActiveBullet, PAGINATION.BULLET_ACTIVE_CLASS);
  };

  private _onFractionChanged = () => {
    const flicking = this._flicking!;
    const wrapper = this._wrapper;
    const currentWrapper = wrapper.querySelector(`.${this._fractionCurrentClass}`) as HTMLElement;
    const totalWrapper = wrapper.querySelector(`.${this._fractionTotalClass}`) as HTMLElement;
    const anchorPoints = flicking.camera.anchorPoints;

    const currentIndex = anchorPoints.length > 0
      ? anchorPoints[0].panel.index + flicking.index + 1
      : 0;

    currentWrapper.innerHTML = this._fractionCurrentFormat(currentIndex);
    totalWrapper.innerHTML = this._fractionTotalFormat(anchorPoints.length);
  };

  private _removeAllChilds() {
    const wrapper = this._wrapper;

    while (wrapper.firstChild) {
      wrapper.removeChild(wrapper.firstChild);
    }

    this._childs = [];
  }
}

export default Pagination;
