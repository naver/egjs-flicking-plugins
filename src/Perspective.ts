/* eslint-disable no-underscore-dangle */
import Flicking, { EVENTS, Plugin } from "@egjs/flicking";

interface PerspectiveOptions {
  selector: string;
  scale: number;
  rotate: number;
  perspective: number;
}

/**
 * You can apply perspective effect while panel is moving.
 * @ko 패널들을 움직이면서 입체감을 부여할 수 있습니다.
 * @memberof Flicking.Plugins
 */
class Perspective implements Plugin {
  private _flicking: Flicking | null;

  /* Options  */
  private _selector: PerspectiveOptions["selector"];
  private _scale: PerspectiveOptions["scale"];
  private _rotate: PerspectiveOptions["rotate"];
  private _perspective: PerspectiveOptions["perspective"];

  public get selector() { return this._selector; }
  public get scale() { return this._scale; }
  public get rotate() { return this._rotate; }
  public get perspective() { return this._perspective; }

  public set selector(val: string) { this._selector = val; }
  public set scale(val: number) { this._scale = val; }
  public set rotate(val: number) { this._rotate = val; }
  public set perspective(val: number) { this._perspective = val; }

  /**
   * @param - The selector of the element to which the perspective effect is to be applied. If the selector is blank, it applies to panel element. <ko>입체 효과를 적용할 대상의 선택자. 선택자가 공백이면 패널 엘리먼트에 적용된다.</ko>
   * @param - Effect amplication scale.<ko>효과 증폭도</ko>
   * @param - Effect amplication rotate.<ko>회전 증폭도</ko>
   * @param - The value of perspective CSS property. <ko>css perspective 속성 값</ko>
   * @example
   * ```ts
   * flicking.addPlugins(new Perspective({ selector: "p", scale: 1, rotate: 1, perspective = 1000 }));
   * ```
   */
  public constructor({ selector = "", scale = 1, rotate = 1, perspective = 1000 }: Partial<PerspectiveOptions> = {}) {
    this._flicking = null;
    this._selector = selector;
    this._scale = scale;
    this._rotate = rotate;
    this._perspective = perspective;
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
    const rotate =  this._rotate;
    const perspective = this._perspective;

    if (!flicking) return;

    const horizontal = flicking.horizontal;
    const panels = flicking.visiblePanels;

    panels.forEach((panel) => {
      const progress = panel.outsetProgress;
      const el = panel.element;
      const target = selector ? el.querySelector<HTMLElement>(selector)! : el;
      const panelScale = 1 / (Math.abs(progress * scale) + 1);
      const rotateDegree = progress > 0 ? Math.min(90, progress * 100 * rotate) : Math.max(-90, progress * 100 * rotate);
      const [rotateX, rotateY] = horizontal ? [0, rotateDegree] : [rotateDegree, 0];

      target.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${panelScale})`;
    });
  };
}

export default Perspective;
