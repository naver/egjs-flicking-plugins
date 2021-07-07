import { ComponentEvent } from "@egjs/component";
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
  private _flickings: Flicking[];

  /* Options */
  private _others: SyncOptions["others"];

  public get others() { return this._others; }

  public set others(val: SyncOptions["others"]) {
    this._flickings.forEach((flicking) => {
      flicking.off(EVENTS.MOVE, this._onMove);
      flicking.off(EVENTS.MOVE_START, this._onMoveStart);
      flicking.off(EVENTS.MOVE_END, this._onMoveEnd);
    });
    
    this._others = val;
    this._flickings = [this._flicking!, ...this._others];

    this._flickings.forEach((flicking) => {
      flicking.on(EVENTS.MOVE, this._onMove);
      flicking.on(EVENTS.MOVE_START, this._onMoveStart);
      flicking.on(EVENTS.MOVE_END, this._onMoveEnd);
    });
  }

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
    this._flickings = [flicking, ...this._others];

    this._flickings.forEach((flicking) => {
      flicking.on(EVENTS.MOVE, this._onMove);
      flicking.on(EVENTS.MOVE_START, this._onMoveStart);
      flicking.on(EVENTS.MOVE_END, this._onMoveEnd);
    });

  }

  public destroy(): void {
    const flicking = this._flicking;

    if (!flicking) {
      return;
    }

    this._flickings.forEach((flicking) => {
      flicking.off(EVENTS.MOVE, this._onMove);
      flicking.off(EVENTS.MOVE_START, this._onMoveStart);
      flicking.off(EVENTS.MOVE_END, this._onMoveEnd);
    });

    this._flicking = null;
  }

  public update(): void {
    // DO-NOTHING
  }

  private _onMove = (e: ComponentEvent): void => {
    const camera = e.currentTarget.camera;
    const progress = (camera.position - camera.range.min) / camera.rangeDiff;

    this._flickings.forEach(flicking => {
      if (flicking !== e.currentTarget) {
        flicking.camera.lookAt(flicking.camera.range.min + flicking.camera.rangeDiff * progress);
      }
    });
  };

  private _onMoveStart = (e: ComponentEvent): void => {
    this._flickings.forEach(flicking => {
      if (flicking !== e.currentTarget) {
        flicking.disableInput();
      }
    });
  };

  private _onMoveEnd = (e: ComponentEvent): void => {
    this._flickings.forEach(flicking => {
      if (flicking !== e.currentTarget) {
        flicking.enableInput();
        flicking.control.updateInput();
      }
    });
  };
}

export default Sync;
