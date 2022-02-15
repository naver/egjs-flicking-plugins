import Flicking, { EVENTS, Plugin } from "@egjs/flicking";

/**
 * You can apply parallax effect while panel is moving.
 * @ko 패널들을 움직이면서 parallax 효과를 부여할 수 있습니다.
 * @memberof Flicking.Plugins
 */
class Parallax implements Plugin {
  private _flicking: Flicking | null;

  /* Options  */
  private _selector: string;
  private _scale: number;

  public get selector() { return this._selector; }
  public get scale() { return this._scale; }

  public set selector(val: string) { this._selector = val; }
  public set scale(val: number) { this._scale = val; }

  /**
   * @param {string} selector Selector of the element to apply parallax effect<ko> Parallax 효과를 적용할 엘리먼트의 선택자 </ko>
   * @param {number} scale Effect amplication scale<ko>효과 증폭도</ko>
   * @example
   * ```ts
   * flicking.addPlugins(new Parallax("img", 1));
   * ```
   */
  public constructor(selector = "", scale = 1) {
    this._flicking = null;
    this._selector = selector;
    this._scale = scale;
  }

  public init(flicking: Flicking): void {
    if (this._flicking) {
      this.destroy();
    }

    this._flicking = flicking;

    flicking.on(EVENTS.MOVE, this._onMove);
    flicking.on(EVENTS.AFTER_RESIZE, this.update);
    this._onMove();
  }

  public destroy(): void {
    if (!this._flicking) return;

    this._flicking.off(EVENTS.MOVE, this._onMove);
    this._flicking.off(EVENTS.AFTER_RESIZE, this.update);
    this._flicking = null;
  }

  public update = (): void => {
    this._onMove();
  };

  private _onMove = (): void => {
    const flicking = this._flicking;

    if (!flicking) return;

    const panels = flicking.visiblePanels;

    panels.forEach(panel => {
      const progress = panel.outsetProgress;
      const el = panel.element;
      const target = this._selector ? el.querySelector<HTMLElement>(this._selector)! : el;
      const parentTarget = target.parentNode as Element;
      const rect = target.getBoundingClientRect();
      const parentRect = parentTarget.getBoundingClientRect();
      const position = (parentRect.width - rect.width) / 2 * progress * this._scale;
      const transform = `translate(-50%) translate(${position}px)`;
      const style = target.style;

      style.cssText += `transform: ${transform};-webkit-transform: ${transform};-ms-transform:${transform}`;
    });
  };
}
export default Parallax;
