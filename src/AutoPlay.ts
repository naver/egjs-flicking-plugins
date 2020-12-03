import Flicking, { Plugin, Direction } from "@egjs/flicking";

interface AutoPlayOptions {
  duration: number;
  direction: Direction[keyof Direction];
  stopOnHover: boolean;
}

// tslint:disable-next-line naming-convention
const DEFAULT_OPTION: AutoPlayOptions = {
  duration: 2000,
  direction: "NEXT",
  stopOnHover: false,
};

/**
 * Plugin that allow you to automatically move to the next/previous panel, on a specific time basis
 * @ko 일정 시간마다, 자동으로 다음/이전 패널로 넘어가도록 할 수 있는 플러그인
 * @memberof eg.Flicking.plugins
 */
class AutoPlay implements Plugin {
  /* Options */
  private duration: AutoPlayOptions["duration"];
  private direction: AutoPlayOptions["direction"];
  private stopOnHover: AutoPlayOptions["stopOnHover"];

  /* Internal Values */
  private flicking: Flicking | null = null;
  private timerId = 0;
  private mouseEntered = false;

  /**
   * @param options Options for the AutoPlay instance.<ko>AutoPlay 옵션</ko>
   * @param options.duration Time to wait before moving on to the next panel.<ko>다음 패널로 움직이기까지 대기 시간</ko>
   * @param options.direction The direction in which the panel moves.<ko>패널이 움직이는 방향</ko>
   * @param options.stopOnHover Whether to stop when mouse hover upon the element.<ko>엘리먼트에 마우스를 올렸을 때 AutoPlay를 정지할지 여부</ko>
   * @example
   * flicking.addPlugins(new eg.Flicking.plugins.AutoPlay(2000, "NEXT"));
   */
  constructor(options: Partial<AutoPlayOptions> = DEFAULT_OPTION, direction: AutoPlayOptions["direction"] = DEFAULT_OPTION.direction) {
    if (typeof options === "number") {
      // Fallback for previous interface
      this.duration = options as number;
      this.direction = direction;
      this.stopOnHover = DEFAULT_OPTION.stopOnHover;
      return;
    }

    const mergedOptions = {
      ...DEFAULT_OPTION,
      ...options,
    } as AutoPlayOptions;
    const { duration, direction: dir, stopOnHover } = mergedOptions;

    this.duration = duration;
    this.direction = dir;
    this.stopOnHover = stopOnHover;
  }

  public init(flicking: Flicking): void {
    flicking.on({
      moveStart: this.stop,
      holdStart: this.stop,
      moveEnd: this.play,
      select: this.play,
    });

    this.flicking = flicking;
    if (this.stopOnHover) {
      const targetEl = this.flicking.getElement();
      targetEl.addEventListener("mouseenter", this.onMouseEnter, false);
      targetEl.addEventListener("mouseleave", this.onMouseLeave, false);
    }

    this.play();
  }

  public destroy(): void {
    const flicking = this.flicking;
    this.mouseEntered = false;
    this.stop();

    if (!flicking) {
      return;
    }

    flicking.off("moveStart", this.stop);
    flicking.off("holdStart", this.stop);
    flicking.off("moveEnd", this.play);
    flicking.off("select", this.play);

    const targetEl = flicking.getElement();
    targetEl.removeEventListener("mouseenter", this.onMouseEnter, false);
    targetEl.removeEventListener("mouseleave", this.onMouseLeave, false);

    this.flicking = null;
  }

  public play = () => {
    const flicking = this.flicking;
    if (!flicking) {
      return;
    }

    this.stop();

    if (this.mouseEntered || flicking.isPlaying()) {
      return;
    }

    this.timerId = window.setTimeout(() => {
      flicking[this.direction === "NEXT" ? "next" : "prev"]();

      this.play();
    }, this.duration);
  }

  public stop = () => {
    clearTimeout(this.timerId);
  }

  private onMouseEnter = () => {
    this.mouseEntered = true;
    this.stop();
  }

  private onMouseLeave = () => {
    this.mouseEntered = false;
    this.play();
  }
}

export default AutoPlay;
