import Flicking, { Plugin, DIRECTION } from "@egjs/flicking";

interface AutoPlayOptions {
  duration: number;
  direction: typeof DIRECTION["NEXT"] | typeof DIRECTION["PREV"];
  stopOnHover: boolean;
}

/**
 * Plugin that allow you to automatically move to the next/previous panel, on a specific time basis
 * @ko 일정 시간마다, 자동으로 다음/이전 패널로 넘어가도록 할 수 있는 플러그인
 * @memberof Flicking.Plugins
 */
class AutoPlay implements Plugin {
  /* Options */
  private _duration: AutoPlayOptions["duration"];
  private _direction: AutoPlayOptions["direction"];
  private _stopOnHover: AutoPlayOptions["stopOnHover"];

  /* Internal Values */
  private _flicking: Flicking | null = null;
  private _timerId = 0;
  private _mouseEntered = false;

  public get duration() { return this._duration; }
  public get direction() { return this._direction; }
  public get stopOnHover() { return this._stopOnHover; }

  public set duration(val: number) { this._duration = val; }
  public set direction(val: AutoPlayOptions["direction"]) { this._direction = val; }
  public set stopOnHover(val: boolean) { this._stopOnHover = val; }

  /**
   * @param {AutoPlayOptions} options Options for the AutoPlay instance.<ko>AutoPlay 옵션</ko>
   * @param {number} options.duration Time to wait before moving on to the next panel.<ko>다음 패널로 움직이기까지 대기 시간</ko>
   * @param {"PREV" | "NEXT"} options.direction The direction in which the panel moves.<ko>패널이 움직이는 방향</ko>
   * @param {boolean} options.stopOnHover Whether to stop when mouse hover upon the element.<ko>엘리먼트에 마우스를 올렸을 때 AutoPlay를 정지할지 여부</ko>
   * @example
   * flicking.addPlugins(new AutoPlay(2000, "NEXT"));
   */
  public constructor({
    duration = 2000,
    direction = "NEXT",
    stopOnHover = false
  }: Partial<AutoPlayOptions> = {}) {
    this._duration = duration;
    this._direction = direction;
    this._stopOnHover = stopOnHover;
  }

  public init(flicking: Flicking): void {
    if (this._flicking) {
      this.destroy();
    }

    flicking.on({
      moveStart: this.stop,
      holdStart: this.stop,
      moveEnd: this.play,
      select: this.play
    });

    this._flicking = flicking;
    if (this._stopOnHover) {
      const targetEl = this._flicking.element;
      targetEl.addEventListener("mouseenter", this._onMouseEnter, false);
      targetEl.addEventListener("mouseleave", this._onMouseLeave, false);
    }

    this.play();
  }

  public destroy(): void {
    const flicking = this._flicking;

    this._mouseEntered = false;
    this.stop();

    if (!flicking) {
      return;
    }

    flicking.off("moveStart", this.stop);
    flicking.off("holdStart", this.stop);
    flicking.off("moveEnd", this.play);
    flicking.off("select", this.play);

    const targetEl = flicking.element;
    targetEl.removeEventListener("mouseenter", this._onMouseEnter, false);
    targetEl.removeEventListener("mouseleave", this._onMouseLeave, false);

    this._flicking = null;
  }

  public update(): void {
    // DO-NOTHING
  }

  public play = () => {
    const flicking = this._flicking;
    const direction = this._direction;

    if (!flicking) {
      return;
    }

    this.stop();

    if (this._mouseEntered || flicking.animating) {
      return;
    }

    this._timerId = window.setTimeout(() => {
      if (direction === DIRECTION.NEXT) {
        flicking.next().catch(() => void 0);
      } else {
        flicking.prev().catch(() => void 0);
      }

      this.play();
    }, this._duration);
  };

  public stop = () => {
    clearTimeout(this._timerId);
  };

  private _onMouseEnter = () => {
    this._mouseEntered = true;
    this.stop();
  };

  private _onMouseLeave = () => {
    this._mouseEntered = false;
    this.play();
  };
}

export default AutoPlay;
