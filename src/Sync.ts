import { ComponentEvent } from "@egjs/component";
import Flicking, { EVENTS, Panel, Plugin } from "@egjs/flicking";

import { SYNC } from "./const";
import { addClass, removeClass } from "./utils";

interface SyncOptions {
  type: "camera" | "index";
  synchronizedFlickingOptions: SychronizableFlickingOptions[];
}

interface SychronizableFlickingOptions {
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
    this.preventEvent(() => {
        this._type = val;
    });
  }

  public set synchronizedFlickingOptions(val: SyncOptions["synchronizedFlickingOptions"]) {
    this.preventEvent(() => {
      this._synchronizedFlickingOptions = val;
    });
  }

  private preventEvent(fn: () => void) {
    this._removeEvents(this._synchronizedFlickingOptions);
    fn();
    this._addEvents(this._synchronizedFlickingOptions);
  }

  public constructor({
    type = SYNC.TYPE.CAMERA,
    synchronizedFlickingOptions = [],
  }: Partial<SyncOptions> = {}) {
    this._type = type;
    this._synchronizedFlickingOptions = synchronizedFlickingOptions;
  }

  public init(flicking: Flicking): void {
    if (this._flicking) {
      this.destroy();
    }

    this._flicking = flicking;

    this._addEvents(this._synchronizedFlickingOptions);

    this._synchronizedFlickingOptions.forEach(synchronizedFlickingOption => {
      this._updateClass(synchronizedFlickingOption, 0);
    });
  }

  public destroy(): void {
    const flicking = this._flicking;

    if (!flicking) {
      return;
    }

    this._removeEvents(this._synchronizedFlickingOptions);

    this._flicking = null;
  }

  public update(): void {
    this._synchronizedFlickingOptions.forEach(synchronizedFlickingOption => {
      this._updateClass(synchronizedFlickingOption, synchronizedFlickingOption.flicking.camera.position);
    });
  }

  private _addEvents = (synchronizedFlickingOptions: SychronizableFlickingOptions[]): void => {
    synchronizedFlickingOptions.forEach((synchronizedFlickingOption) => {
      if (this._type === "camera") {
        synchronizedFlickingOption.flicking.on(EVENTS.MOVE, this._onMove);
        synchronizedFlickingOption.flicking.on(EVENTS.MOVE_START, this._onMoveStart);
        synchronizedFlickingOption.flicking.on(EVENTS.MOVE_END, this._onMoveEnd);
      }
      if (this._type === "index" && synchronizedFlickingOption.isSlidable) {
        synchronizedFlickingOption.flicking.on(EVENTS.WILL_CHANGE, this._onIndexChange);
      }
      if (synchronizedFlickingOption.isClickable) {
        synchronizedFlickingOption.flicking.on(EVENTS.SELECT, this._onIndexChange);
      }
    });
  };

  private _removeEvents = (synchronizedFlickingOptions: SychronizableFlickingOptions[]): void => {
    synchronizedFlickingOptions.forEach((synchronizedFlickingOption) => {
        if (this._type === "camera") {
          synchronizedFlickingOption.flicking.off(EVENTS.MOVE, this._onMove);
          synchronizedFlickingOption.flicking.off(EVENTS.MOVE_START, this._onMoveStart);
          synchronizedFlickingOption.flicking.off(EVENTS.MOVE_END, this._onMoveEnd);
        }
        if (this._type === "index" && synchronizedFlickingOption.isSlidable) {
          synchronizedFlickingOption.flicking.off(EVENTS.WILL_CHANGE, this._onIndexChange);
        }
        if (synchronizedFlickingOption.isClickable) {
          synchronizedFlickingOption.flicking.off(EVENTS.SELECT, this._onIndexChange);
        }
    });
  };

  private _onIndexChange = (e: ComponentEvent): void => {
    const flicking = e.currentTarget;
    if (!flicking.initialized) {
      return;
    }
    
    this._synchronizeByIndex(flicking, e["index"]);
  };

  private _onMove = (e: ComponentEvent): void => {
    const camera = e.currentTarget.camera;
    const progress = (camera.position - camera.range.min) / camera.rangeDiff;

    this._synchronizedFlickingOptions.forEach(({ flicking }) => {
      if (flicking !== e.currentTarget) {
        if (camera.position < camera.range.min) {
          flicking.camera.lookAt(camera.position);
        }
        else if (camera.position > camera.range.max) {
          flicking.camera.lookAt(flicking.camera.range.max + camera.position - camera.range.max);
        }
        else {
          flicking.camera.lookAt(flicking.camera.range.min + flicking.camera.rangeDiff * progress);
        }
      }
    });
  };

  private _onMoveStart = (e: ComponentEvent): void => {
    this._synchronizedFlickingOptions.forEach(({ flicking }) => {
      if (flicking !== e.currentTarget) {
        flicking.disableInput();
      }
    });
  };

  private _onMoveEnd = (e: ComponentEvent): void => {
    this._synchronizedFlickingOptions.forEach(({ flicking }) => {
      if (flicking !== e.currentTarget) {
        flicking.enableInput();
        flicking.control.updateInput();
      }
    });
  };
  
  private _synchronizeByIndex = (flicking: Flicking, index: number): void => {
    const synchronizedFlickingOptions = this._synchronizedFlickingOptions;
    const activePanel =  flicking.panels.find(panel => panel.index === index);
    const lastPanel = flicking.panels[flicking.panels.length - 1];

    if (!activePanel) {
      return;
    }

    this.preventEvent(() => {
      synchronizedFlickingOptions.forEach((synchronizedFlickingOption) => {
        // calculate new target flicking position with active flicking size and target flicking size
        const targetLastPanel = synchronizedFlickingOption.flicking.panels[synchronizedFlickingOption.flicking.panels.length - 1];
        const targetPos = activePanel.position / (lastPanel.position + (lastPanel.size / 2)) * (targetLastPanel.position + (targetLastPanel.size / 2));
  
        synchronizedFlickingOption.flicking.control.moveToPosition(targetPos, 500).catch(() => void 0);
        if (synchronizedFlickingOption.activeClass) {
          this._updateClass(synchronizedFlickingOption, targetPos);
        }
      });
    });
  };
  
  private _updateClass(synchronizedFlickingOption: SychronizableFlickingOptions, pos: number): void {
    const target = this._findNearsetPanel(synchronizedFlickingOption.flicking, pos);
    synchronizedFlickingOption.flicking.panels.forEach((panel) => {
      panel.index === target.index ? addClass(panel.element, synchronizedFlickingOption.activeClass) : removeClass(panel.element, synchronizedFlickingOption.activeClass);
    });
  };

  private _findNearsetPanel(flicking: Flicking, pos: number): Panel {
    const nearsetIndex = flicking.panels.reduce((nearest, panel, index) => {
      return Math.abs(panel.position - pos) <= nearest.range ? {
        index,
        range: Math.abs(panel.position - pos),
      } : nearest;
    }, {
      index: 0,
      range: Infinity,
    }).index;
    return flicking.panels[nearsetIndex];
  };
}

export default Sync;
