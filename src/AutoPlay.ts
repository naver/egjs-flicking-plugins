import Flicking, { FlickingEvent, Plugin, Direction } from "@egjs/flicking";

/**
 * Plugin that allow you to automatically move to the next/previous panel, on a specific time basis
 * @ko 일정 시간마다, 자동으로 다음/이전 패널로 넘어가도록 할 수 있는 플러그인
 * @memberof eg.Flicking.plugins
 */
class AutoPlay implements Plugin {
  private timerId = 0;
  /**
   * @param - Time to wait before moving on to the next panel <ko>다음 패널로 움직이기까지 대기 시간</ko>
   * @param - The direction in which the panel moves. <ko>패널이 움직이는 방향</ko>
   * @example
   * flicking.addPlugins(new eg.Flicking.plugins.AutoPlay(2000, "NEXT"));
   */
  constructor(private duration: number = 2000, private direction: Direction[keyof Direction] = "NEXT") {}
  public init(flicking: Flicking): void {
    flicking.on({
      move: this.onStop,
      holdStart: this.onStop,
      select: this.onPlay,
      moveEnd: this.onPlay,
    });

    this.play(flicking);
  }
  public destroy(flicking: Flicking): void {
    this.onStop();
    flicking.off("moveStart", this.onStop);
    flicking.off("holdStart", this.onStop);
    flicking.off("moveEnd", this.onPlay);
    flicking.off("select", this.onPlay);
  }
  private play(flicking: Flicking) {
    this.onStop();

    this.timerId = window.setTimeout(() => {
      flicking[this.direction === "NEXT" ? "next" : "prev"]();

      this.play(flicking);
    }, this.duration);
  }
  private onPlay = (e: FlickingEvent): void => {
    this.play(e.currentTarget);
  }
  private onStop = () => {
    clearTimeout(this.timerId);
  }
}

export default AutoPlay;
