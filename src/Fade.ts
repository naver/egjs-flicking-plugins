import Flicking, { EVENTS, Plugin } from "@egjs/flicking";

/**
 * You can apply fade in / out effect while panel is moving.
 * @ko 패널들을 움직이면서 fade in / out 효과를 부여할 수 있습니다.
 * @memberof Flicking.Plugins
 */
class Fade implements Plugin {
  private _flicking: Flicking | null;

  /* Options  */
  private _selector: string;
  private _scale: number;

  public get selector() { return this._selector; }
  public get scale() { return this._scale; }

  public set selector(val: string) { this._selector = val; }
  public set scale(val: number) { this._scale = val; }

  /**
   * @param - The selector of the element to which the fade effect is to be applied. If the selector is blank, it applies to panel element. <ko>Fade 효과를 적용할 대상의 선택자. 선택자가 공백이면 패널 엘리먼트에 적용된다.</ko>
   * @param - Effect amplication scale<ko>효과 증폭도</ko>
   * @example
   * ```ts
   * flicking.addPlugins(new Fade("p", 1));
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
    const selector = this._selector;
    const scale = this._scale;

    if (!flicking) return;

    const panels = flicking.visiblePanels;

    panels.forEach(panel => {
      const progress = panel.outsetProgress;
      const el = panel.element;
      const target = selector ? el.querySelector<HTMLElement>(selector)! : el;

      if (target) {
        const opacity = Math.min( 1, Math.max(0, 1 - Math.abs(progress * scale)));
        target.style.opacity = `${opacity}`;
      }
    });
  };
}

export default Fade;
