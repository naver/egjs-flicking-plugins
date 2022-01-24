import Flicking, { clamp, EVENTS } from "@egjs/flicking";
import type { MoveEndEvent, MoveEvent, MoveStartEvent, Plugin, WillChangeEvent, SelectEvent } from "@egjs/flicking";

import { SYNC } from "./const";
import { addClass, removeClass } from "./utils";

/**
 * @property {string} [type="camera"] Types of methods to synchronize between Flickings. "camera" will sync by camera position, and "index" will sync by panel index
 * @property {SychronizableFlickingOptions} [synchronizedFlickingOptions=[]]	Detailed options for syncing Flickings.
 */
export interface SyncOptions {
  type: typeof SYNC.TYPE.CAMERA | typeof SYNC.TYPE.INDEX;
  synchronizedFlickingOptions: SychronizableFlickingOptions[];
}

/**
 * @property {Flicking} flicking An instance of Flicking to sync
 * @property {boolean} [isClickable=false] By enabling this option, clicking the given Flicking's panel will change the given & other Flicking's index
 * @property {boolean} [isSlidable=false] By enabling this option, the given Flicking's scroll with mouse/touch input will change other Flicking's index. Only available for the index type
 * @property {string | undefined} [activeClass=undefined] An extra class for the panels when selected
 */
export interface SychronizableFlickingOptions {
  flicking: Flicking;
  isClickable?: boolean;
  isSlidable?: boolean;
  activeClass?: string;
}

/**
 * Plugin for synchronizing multiple flickings
 * @ko 다양한 형태로 Flicking들이 같이 움직이게 할 수 있습니다.
 * @memberof Flicking.Plugins
 */
class Sync implements Plugin {
  /* Internal Values */
  private _flicking: Flicking | null = null;

  /* Options */
  private _type: SyncOptions["type"];
  private _synchronizedFlickingOptions: SyncOptions["synchronizedFlickingOptions"];

  public get type() { return this._type; }
  public get synchronizedFlickingOptions() { return this._synchronizedFlickingOptions; }

  public set type(val: SyncOptions["type"]) {
    this._type = val;
  }

  public set synchronizedFlickingOptions(val: SyncOptions["synchronizedFlickingOptions"]) {
    this._synchronizedFlickingOptions = val;
  }

  /** */
  public constructor({
    type = SYNC.TYPE.CAMERA,
    synchronizedFlickingOptions = []
  }: Partial<SyncOptions> = {}) {
    this._type = type;
    this._synchronizedFlickingOptions = synchronizedFlickingOptions;
  }

  public init(flicking: Flicking): void {
    const synced = this._synchronizedFlickingOptions;

    if (this._flicking) {
      this.destroy();
    }

    this._flicking = flicking;

    this._addEvents();

    synced.forEach(options => {
      const { flicking: syncedFlicking } = options;

      this._updateClass(options, syncedFlicking.defaultIndex);
    });
  }

  public destroy(): void {
    const flicking = this._flicking;

    if (!flicking) {
      return;
    }

    this._removeEvents();

    this._flicking = null;
  }

  public update(): void {
    this._synchronizedFlickingOptions.forEach(options => {
      this._updateClass(options, options.flicking.index);
    });
  }

  private _preventEvent(fn: () => void) {
    this._removeEvents();
    fn();
    this._addEvents();
  }

  private _addEvents = (): void => {
    const type = this._type;
    const synced = this._synchronizedFlickingOptions;

    synced.forEach(({ flicking, isSlidable, isClickable }) => {
      if (type === SYNC.TYPE.CAMERA) {
        flicking.on(EVENTS.MOVE, this._onMove);
        flicking.on(EVENTS.MOVE_START, this._onMoveStart);
        flicking.on(EVENTS.MOVE_END, this._onMoveEnd);
      }
      if (type === SYNC.TYPE.INDEX && isSlidable) {
        flicking.on(EVENTS.WILL_CHANGE, this._onIndexChange);
        flicking.on(EVENTS.WILL_RESTORE, this._onIndexChange);
      }
      if (isClickable) {
        flicking.on(EVENTS.SELECT, this._onSelect);
      }
    });
  };

  private _removeEvents = (): void => {
    const type = this._type;
    const synced = this._synchronizedFlickingOptions;

    synced.forEach(({ flicking, isSlidable, isClickable }) => {
      if (type === SYNC.TYPE.CAMERA) {
        flicking.off(EVENTS.MOVE, this._onMove);
        flicking.off(EVENTS.MOVE_START, this._onMoveStart);
        flicking.off(EVENTS.MOVE_END, this._onMoveEnd);
      }
      if (type === SYNC.TYPE.INDEX && isSlidable) {
        flicking.off(EVENTS.WILL_CHANGE, this._onIndexChange);
        flicking.off(EVENTS.WILL_RESTORE, this._onIndexChange);
      }
      if (isClickable) {
        flicking.off(EVENTS.SELECT, this._onSelect);
      }
    });
  };

  private _onIndexChange = (e: WillChangeEvent): void => {
    const flicking = e.currentTarget;

    if (!flicking.initialized) {
      return;
    }

    this._synchronizeByIndex(flicking, e.index);
  };

  private _onMove = (e: MoveEvent): void => {
    const camera = e.currentTarget.camera;
    const progress = (camera.position - camera.range.min) / camera.rangeDiff;

    this._synchronizedFlickingOptions.forEach(({ flicking }) => {
      if (flicking === e.currentTarget) return;

      let targetPosition = 0;

      if (camera.position < camera.range.min) {
        targetPosition = camera.position;
      } else if (camera.position > camera.range.max) {
        targetPosition = flicking.camera.range.max + camera.position - camera.range.max;
      } else {
        targetPosition = flicking.camera.range.min + flicking.camera.rangeDiff * progress;
      }

      void flicking.camera.lookAt(targetPosition);
    });
  };

  private _onMoveStart = (e: MoveStartEvent): void => {
    this._synchronizedFlickingOptions.forEach(({ flicking }) => {
      if (flicking !== e.currentTarget) {
        flicking.disableInput();
      }
    });
  };

  private _onMoveEnd = (e: MoveEndEvent): void => {
    this._synchronizedFlickingOptions.forEach(({ flicking }) => {
      if (flicking !== e.currentTarget) {
        flicking.enableInput();
        flicking.control.updateInput();
      }
    });
  };

  private _onSelect = (e: SelectEvent): void => {
    void e.currentTarget.moveTo(e.index).catch(() => void 0);

    this._synchronizeByIndex(e.currentTarget, e.index);
  };

  private _synchronizeByIndex = (activeFlicking: Flicking, index: number): void => {
    const synchronizedFlickingOptions = this._synchronizedFlickingOptions;

    this._preventEvent(() => {
      synchronizedFlickingOptions.forEach(options => {
        // Active class should be applied same to the Flicking which triggered event
        this._updateClass(options, index);

        const { flicking } = options;
        if (flicking === activeFlicking) return;

        const targetIndex = clamp(index, 0, flicking.panels.length);

        if (flicking.animating) {
          // Reserve moveTo once previous animation is finished
          flicking.once(EVENTS.MOVE_END, () => {
            void flicking.moveTo(targetIndex).catch(() => void 0);
          });
        } else {
          void flicking.moveTo(targetIndex);
        }
      });
    });
  };

  private _updateClass = ({ flicking, activeClass }: SychronizableFlickingOptions, index: number): void => {
    if (!activeClass) return;

    flicking.panels.forEach(panel => {
      if (panel.index === index)  {
        addClass(panel.element, activeClass);
      } else {
        removeClass(panel.element, activeClass);
      }
    });
  };
}

export default Sync;
