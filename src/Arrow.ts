import Flicking, { EVENTS, FlickingError, Plugin, WillChangeEvent } from "@egjs/flicking";

import { BROWSER } from "./event";
import { ARROW } from "./const";
import { addClass, getElement, removeClass } from "./utils";

interface ArrowOptions {
  parentEl: HTMLElement | null;
  prevElSelector: string;
  nextElSelector: string;
  disabledClass: string;
  moveCount: number;
  moveByViewportSize: boolean;
  interruptable: boolean;
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
  private _nextIndex: number;

  /* Options */
  private _parentEl: ArrowOptions["parentEl"];
  private _prevElSelector: ArrowOptions["prevElSelector"];
  private _nextElSelector: ArrowOptions["nextElSelector"];
  private _disabledClass: ArrowOptions["disabledClass"];
  private _moveCount: ArrowOptions["moveCount"];
  private _moveByViewportSize: ArrowOptions["moveByViewportSize"];
  private _interruptable: ArrowOptions["interruptable"];

  public get prevEl() { return this._prevEl; }
  public get nextEl() { return this._nextEl; }

  public get parentEl() { return this._parentEl; }
  public get prevElSelector() { return this._prevElSelector; }
  public get nextElSelector() { return this._nextElSelector; }
  public get disabledClass() { return this._disabledClass; }
  public get moveCount() { return this._moveCount; }
  public get moveByViewportSize() { return this._moveByViewportSize; }
  public get interruptable() { return this._interruptable; }

  public set parentEl(val: ArrowOptions["parentEl"]) { this._parentEl = val; }
  public set prevElSelector(val: ArrowOptions["prevElSelector"]) { this._prevElSelector = val; }
  public set nextElSelector(val: ArrowOptions["nextElSelector"]) { this._nextElSelector = val; }
  public set disabledClass(val: ArrowOptions["disabledClass"]) { this._disabledClass = val; }
  public set moveCount(val: ArrowOptions["moveCount"]) { this._moveCount = val; }
  public set moveByViewportSize(val: ArrowOptions["moveByViewportSize"]) { this._moveByViewportSize = val; }
  public set interruptable(val: ArrowOptions["interruptable"]) { this._interruptable = val; }

  public constructor({
    parentEl = null,
    prevElSelector = ARROW.PREV_SELECTOR,
    nextElSelector = ARROW.NEXT_SELECTOR,
    disabledClass = ARROW.DISABLED_CLASS,
    moveCount = 1,
    moveByViewportSize = false,
    interruptable = false
  }: Partial<ArrowOptions> = {}) {
    this._parentEl = parentEl;
    this._prevElSelector = prevElSelector;
    this._nextElSelector = nextElSelector;
    this._disabledClass = disabledClass;
    this._moveCount = moveCount;
    this._moveByViewportSize = moveByViewportSize;
    this._interruptable = interruptable;
  }

  public init(flicking: Flicking): void {
    if (this._flicking) {
      this.destroy();
    }

    this._flicking = flicking;

    flicking.on(EVENTS.MOVE, this._onAnimation);
    flicking.on(EVENTS.WILL_CHANGE, this._onWillChange);

    const parentEl = this._parentEl ? this._parentEl : flicking.element;
    const prevEl = getElement(this._prevElSelector, parentEl, "Arrow");
    const nextEl = getElement(this._nextElSelector, parentEl, "Arrow");

    [BROWSER.MOUSE_DOWN, BROWSER.TOUCH_START].forEach(evt => {
      prevEl.addEventListener(evt, this._preventInputPropagation, { passive: true });
      nextEl.addEventListener(evt, this._preventInputPropagation, { passive: true });
    });

    prevEl.addEventListener(BROWSER.CLICK, this._onPrevClick);
    nextEl.addEventListener(BROWSER.CLICK, this._onNextClick);

    this._prevEl = prevEl;
    this._nextEl = nextEl;

    this.update();
  }

  public destroy(): void {
    const flicking = this._flicking;

    if (!flicking) {
      return;
    }

    flicking.off(EVENTS.MOVE, this._onAnimation);
    flicking.off(EVENTS.WILL_CHANGE, this._onWillChange);

    const prevEl = this._prevEl;
    const nextEl = this._nextEl;

    [BROWSER.MOUSE_DOWN, BROWSER.TOUCH_START].forEach(evt => {
      prevEl.removeEventListener(evt, this._preventInputPropagation);
      nextEl.removeEventListener(evt, this._preventInputPropagation);
    });

    prevEl.removeEventListener(BROWSER.CLICK, this._onPrevClick);
    nextEl.removeEventListener(BROWSER.CLICK, this._onNextClick);
    this._flicking = null;
  }

  public update(): void {
    this._updateClass(this._flicking!.camera.position);
  }

  private _preventInputPropagation = (e: Event) => {
    e.stopPropagation();
  };

  private _onPrevClick = () => {
    const flicking = this._flicking!;
    const index = flicking.animating ? this._nextIndex : flicking.index;
    const currentPanel = flicking.animating ? flicking.panels[this._nextIndex] : flicking.currentPanel;
    const camera = flicking.camera;
    const anchorPoints = camera.anchorPoints;

    if ((flicking.animating && !this.interruptable) || anchorPoints.length <= 0) return;

    if (flicking.animating) {
      flicking.stopAnimation();
    }

    const firstAnchor = anchorPoints[0];
    const moveCount = this._moveCount;

    if (this._moveByViewportSize) {
      flicking.control.moveToPosition(camera.position - camera.size, flicking.duration)
        .catch(this._onCatch);
    } else {
      if (flicking.circularEnabled) {
        let targetPanel = currentPanel;

        for (let i = 0; i < moveCount; i++) {
          targetPanel = targetPanel.prev()!;
        }

        targetPanel.focus().catch(this._onCatch);
      } else if (index > firstAnchor.panel.index) {
        flicking.moveTo(Math.max(index - moveCount, firstAnchor.panel.index))
          .catch(this._onCatch);
      } else if (camera.position > camera.range.min) {
        flicking.moveTo(index)
          .catch(this._onCatch);
      }
    }
  };

  private _onNextClick = () => {
    const flicking = this._flicking!;
    const index = flicking.animating ? this._nextIndex : flicking.index;
    const currentPanel = flicking.animating ? flicking.panels[this._nextIndex] : flicking.currentPanel;
    const camera = flicking.camera;
    const anchorPoints = camera.anchorPoints;

    if ((flicking.animating && !this.interruptable) || anchorPoints.length <= 0) return;

    if (flicking.animating) {
      flicking.stopAnimation();
    }

    const lastAnchor = anchorPoints[anchorPoints.length - 1];
    const moveCount = this._moveCount;

    if (this._moveByViewportSize) {
      flicking.control.moveToPosition(camera.position + camera.size, flicking.duration)
        .catch(this._onCatch);
    } else {
      if (flicking.circularEnabled) {
        let targetPanel = currentPanel;

        for (let i = 0; i < moveCount; i++) {
          targetPanel = targetPanel.next()!;
        }

        targetPanel.focus().catch(this._onCatch);
      } else if (index < lastAnchor.panel.index) {
        flicking.moveTo(Math.min(index + moveCount, lastAnchor.panel.index))
          .catch(this._onCatch);
      } else if (camera.position > camera.range.min) {
        flicking.moveTo(index)
          .catch(this._onCatch);
      }
    }
  };

  private _onAnimation = () => {
    const flicking = this._flicking!;
    const camera = flicking.camera;
    const controller = flicking.control.controller;

    if (flicking.holding) {
      this._updateClass(camera.position);
    } else {
      this._updateClass(controller.animatingContext.end);
    }
  };

  private _onWillChange = (e: WillChangeEvent) => {
    this._nextIndex = e.index;
  };

  private _updateClass(pos: number) {
    const flicking = this._flicking!;
    const disabledClass = this._disabledClass;
    const prevEl = this._prevEl;
    const nextEl = this._nextEl;
    const cameraRange = flicking.camera.range;

    const stopAtPrevEdge = flicking.circularEnabled
      ? false
      : pos <= cameraRange.min;
    const stopAtNextEdge = flicking.circularEnabled
      ? false
      : pos >= cameraRange.max;

    if (stopAtPrevEdge) {
      addClass(prevEl, disabledClass);
    } else {
      removeClass(prevEl, disabledClass);
    }

    if (stopAtNextEdge) {
      addClass(nextEl, disabledClass);
    } else {
      removeClass(nextEl, disabledClass);
    }
  }

  private _onCatch = (err: Error) => {
    if (err instanceof FlickingError) return;
    throw err;
  };
}

export default Arrow;
