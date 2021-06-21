import Flicking, { EVENTS, FlickingError, Plugin } from "@egjs/flicking";

import { BROWSER } from "./event";
import { ARROW } from "./const";

interface ArrowOptions {
  parentEl: HTMLElement | null;
  prevElSelector: string;
  nextElSelector: string;
  disabledClass: string;
}

/**
 * A plugin to easily create prev/right arrow button of Flicking
 * @ko 이전/다음 버튼을 쉽게 만들 수 있는 플러그인
 * @memberof Flicking.Plugins
 */
class Arrow implements Plugin {
  /* Internal Values */
  private _flicking: Flicking | null = null;
  private _prevEl: HTMLElement;
  private _nextEl: HTMLElement;

  /* Options */
  private _parentEl: ArrowOptions["parentEl"];
  private _prevElSelector: ArrowOptions["prevElSelector"];
  private _nextElSelector: ArrowOptions["nextElSelector"];
  private _disabledClass: ArrowOptions["disabledClass"];

  public get prevEl() { return this._prevEl; }
  public get nextEl() { return this._nextEl; }

  public get parentEl() { return this._parentEl; }
  public get prevElSelector() { return this._prevElSelector; }
  public get nextElSelector() { return this._nextElSelector; }
  public get disabledClass() { return this._disabledClass; }

  public set parentEl(val: ArrowOptions["parentEl"]) { this._parentEl = val; }
  public set prevElSelector(val: ArrowOptions["prevElSelector"]) { this._prevElSelector = val; }
  public set nextElSelector(val: ArrowOptions["nextElSelector"]) { this._nextElSelector = val; }
  public set disabledClass(val: ArrowOptions["disabledClass"]) { this._disabledClass = val; }

  public constructor({
    parentEl = null,
    prevElSelector = ARROW.PREV_SELECTOR,
    nextElSelector = ARROW.NEXT_SELECTOR,
    disabledClass = ARROW.DISABLED
  }: Partial<ArrowOptions> = {}) {
    this._parentEl = parentEl;
    this._prevElSelector = prevElSelector;
    this._nextElSelector = nextElSelector;
    this._disabledClass = disabledClass;
  }

  public init(flicking: Flicking): void {
    if (this._flicking) {
      this.destroy();
    }

    this._flicking = flicking;

    flicking.on(EVENTS.CHANGED, this._onChanged);

    const parentEl = this._parentEl ? this._parentEl : flicking.element;
    const prevEl = this._getElement(parentEl, this._prevElSelector);
    const nextEl = this._getElement(parentEl, this._nextElSelector);

    [BROWSER.MOUSE_DOWN, BROWSER.TOUCH_START].forEach(evt => {
      prevEl.addEventListener(evt, this._preventInputPropagation);
      nextEl.addEventListener(evt, this._preventInputPropagation);
    });

    prevEl.addEventListener(BROWSER.CLICK, this._onPrevClick);
    nextEl.addEventListener(BROWSER.CLICK, this._onNextClick);

    this._prevEl = prevEl;
    this._nextEl = nextEl;
  }

  public destroy(): void {
    const flicking = this._flicking;

    if (!flicking) {
      return;
    }

    flicking.off(EVENTS.CHANGED, this._onChanged);

    const prevEl = this._prevEl;
    const nextEl = this._nextEl;

    [BROWSER.MOUSE_DOWN, BROWSER.TOUCH_START].forEach(evt => {
      prevEl.removeEventListener(evt, this._preventInputPropagation);
      nextEl.removeEventListener(evt, this._preventInputPropagation);
    });

    prevEl.removeEventListener("click", this._onPrevClick);
    nextEl.removeEventListener("click", this._onNextClick);
    this._flicking = null;
  }

  public update(): void {
    // DO-NOTHING
  }

  private _preventInputPropagation = (e: Event) => {
    e.stopPropagation();
  };

  private _onPrevClick = () => {
    this._flicking!.prev()
      .catch(err => {
        if (err instanceof FlickingError) return;
        throw err;
      });
  };

  private _onNextClick = () => {
    this._flicking!.next()
      .catch(err => {
        if (err instanceof FlickingError) return;
        throw err;
      });
  };

  private _onChanged = () => {
    const camera = this._flicking!.camera;
    const disabledClass = this._disabledClass;
    const atPrevEdge = camera.position === camera.range.min;
    const atNextEdge = camera.position === camera.range.max;

    if (atPrevEdge) {
      this._prevEl.classList.add(disabledClass);
    } else {
      this._prevEl.classList.remove(disabledClass);
    }

    if (atNextEdge) {
      this._nextEl.classList.add(disabledClass);
    } else {
      this._nextEl.classList.remove(disabledClass);
    }
  };

  private _getElement(parent: HTMLElement, selector: string): HTMLElement {
    const el = parent.querySelector(selector);

    if (!el) {
      throw new Error(`[Flicking-Arrow] Couldn't find element inside the "flicking-viewport" element with the given selector: ${selector}`);
    }

    return el as HTMLElement;
  }
}

export default Arrow;
