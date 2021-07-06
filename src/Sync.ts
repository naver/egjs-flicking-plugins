import Flicking, { EVENTS, Plugin } from "@egjs/flicking";

interface SyncOptions {
  others: Flicking[];
}

/**
 * Plugin for synchronizing multiple flickings 
 * @ko 여러 flicking들이 같이 움직이게 할 수 있습니다.
 * @memberof Flicking.Plugins
 */
class Sync implements Plugin {
  /* Internal Values */
  private _flicking: Flicking | null = null;

  /* Options */
  private _others: SyncOptions["others"];

  public get others() { return this._others; }

  public set others(val: SyncOptions["others"]) { this._others = val; }

  public constructor({
    others = [],
  }: Partial<SyncOptions> = {}) {
    this._others = others;
  }

  public init(flicking: Flicking): void {
    if (this._flicking) {
      this.destroy();
    }

    this._flicking = flicking;

    const flickings = [flicking, ...this._others];
    flickings.forEach((flicking, idx) => {
      const others = [...flickings];
      others.splice(idx, 1);

      flicking.on({
        [EVENTS.MOVE]: e => {
          const camera = e.currentTarget.camera;
          const progress = (camera.position - camera.range.min) / camera.rangeDiff;
    
          others.forEach(otherFlicking => {
            otherFlicking.camera.lookAt(otherFlicking.camera.range.min + otherFlicking.camera.rangeDiff * progress);
          });
        },
        [EVENTS.MOVE_START]: e => {
          others.forEach(otherFlicking => {
            otherFlicking.disableInput();
          });
        },
        [EVENTS.MOVE_END]: e => {
          others.forEach(otherFlicking => {
            otherFlicking.enableInput();
            otherFlicking.control.updateInput();
          });
        }
      })
    });

  }

  public destroy(): void {
    const flicking = this._flicking;

    if (!flicking) {
      return;
    }

    this._flicking = null;
  }

  public update(): void {
    // DO-NOTHING
  }
}

export default Sync;
