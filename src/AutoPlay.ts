import Flicking, { EVENTS, Plugin, DIRECTION } from "@egjs/flicking";

interface AutoPlayOptions {
  duration: number;
  animationDuration: number | undefined;
  direction: typeof DIRECTION["NEXT"] | typeof DIRECTION["PREV"];
  stopOnHover: boolean;
  delayAfterHover: number;
}

/**
 * Plugin that allow you to automatically move to the next/previous panel, on a specific time basis
 * @ko 일정 시간마다, 자동으로 다음/이전 패널로 넘어가도록 할 수 있는 플러그인
 * @memberof Flicking.Plugins
 */
class AutoPlay implements Plugin {
  /* Options */
  private _duration: AutoPlayOptions["duration"];
  private _animationDuration: AutoPlayOptions["animationDuration"];
  private _direction: AutoPlayOptions["direction"];
  private _stopOnHover: AutoPlayOptions["stopOnHover"];
  private _delayAfterHover: AutoPlayOptions["delayAfterHover"];

  /* Internal Values */
  private _flicking: Flicking | null = null;
  private _timerId = 0;
  private _mouseEntered = false;
  private _playing = false;

  public get duration() { return this._duration; }
  public get animationDuration() { return this._animationDuration; }
  public get direction() { return this._direction; }
  public get stopOnHover() { return this._stopOnHover; }
  public get delayAfterHover() { return this._delayAfterHover; }
  public get playing() { return this._playing; }

  public set duration(val: number) { this._duration = val; }
  public set animationDuration(val: number | undefined) { this._animationDuration = val; }
  public set direction(val: AutoPlayOptions["direction"]) { this._direction = val; }
  public set stopOnHover(val: boolean) { this._stopOnHover = val; }
  public set delayAfterHover(val: number) { this._delayAfterHover = val; }

  /**
   * @param {AutoPlayOptions} options Options for the AutoPlay instance.<ko>AutoPlay 옵션</ko>
   * @param {number} options.duration Time to wait before moving on to the next panel.<ko>다음 패널로 움직이기까지 대기 시간</ko>
   * @param {number | undefined} options.animationDuration Duration of animation of moving to the next panel. If undefined, duration option of the Flicking instance is used instead.<ko>패널이 움직이는 애니메이션의 지속 시간, undefined라면 Flicking 인스턴스의 duration 값을 사용한다</ko>
   * @param {"PREV" | "NEXT"} options.direction The direction in which the panel moves.<ko>패널이 움직이는 방향</ko>
   * @param {boolean} options.stopOnHover Whether to stop when mouse hover upon the element.<ko>엘리먼트에 마우스를 올렸을 때 AutoPlay를 정지할지 여부</ko>
   * @param {number} options.delayAfterHover If stopOnHover is true, the amount of time to wait before moving on to the next panel when mouse leaves the element.<ko>stopOnHover를 사용한다면 마우스가 엘리먼트로부터 나간 뒤 다음 패널로 움직이기까지 대기 시간</ko>
   * @example
   * ```ts
   * flicking.addPlugins(new AutoPlay({ duration: 2000, direction: "NEXT" }));
   * ```
   */
  public constructor({
    duration = 2000,
    animationDuration = undefined,
    direction = DIRECTION.NEXT,
    stopOnHover = false,
    delayAfterHover
  }: Partial<AutoPlayOptions> = {}) {
    this._duration = duration;
    this._animationDuration = animationDuration;
    this._direction = direction;
    this._stopOnHover = stopOnHover;
    this._delayAfterHover = delayAfterHover ?? duration;
  }

  public init(flicking: Flicking): void {
    if (this._flicking) {
      this.destroy();
    }

    flicking.on({
      [EVENTS.MOVE_START]: this.stop,
      [EVENTS.HOLD_START]: this.stop,
      [EVENTS.MOVE_END]: this.play,
      [EVENTS.SELECT]: this.play
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

    flicking.off(EVENTS.MOVE_START, this.stop);
    flicking.off(EVENTS.HOLD_START, this.stop);
    flicking.off(EVENTS.MOVE_END, this.play);
    flicking.off(EVENTS.SELECT, this.play);

    const targetEl = flicking.element;
    targetEl.removeEventListener("mouseenter", this._onMouseEnter, false);
    targetEl.removeEventListener("mouseleave", this._onMouseLeave, false);

    this._flicking = null;
  }

  public update(): void {
    // DO-NOTHING
  }

  public play = () => {
    this._movePanel(this._duration);
  };

  public stop = () => {
    this._playing = false;
    clearTimeout(this._timerId);
  };

  private _movePanel(duration: number): void {
    const flicking = this._flicking;
    const direction = this._direction;

    if (!flicking) {
      return;
    }

    this.stop();

    if (this._mouseEntered || flicking.animating) {
      return;
    }

    this._playing = true;
    this._timerId = window.setTimeout(() => {
      if (direction === DIRECTION.NEXT) {
        flicking.next(this._animationDuration).catch(() => void 0);
      } else {
        flicking.prev(this._animationDuration).catch(() => void 0);
      }

      this.play();
    }, duration);
  }

  private _onMouseEnter = () => {
    this._mouseEntered = true;
    this.stop();
  };

  private _onMouseLeave = () => {
    this._mouseEntered = false;
    this._movePanel(this._delayAfterHover);
  };
}

export default AutoPlay;
