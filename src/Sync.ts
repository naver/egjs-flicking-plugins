import { ComponentEvent } from "@egjs/component";
import Flicking, { EVENTS, Plugin } from "@egjs/flicking";

import { SYNC } from "./const";
import { addClass, removeClass } from "./utils";

interface SyncOptions {
  type: "camera" | "index";
  synchronizedFlickings: SychronisableFlickingOptions[];
}

interface SychronisableFlickingOptions {
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
  private _synchronizedFlickings: SyncOptions["synchronizedFlickings"];

  public get type() { return this._type; }
  public get synchronizedFlickings() { return this._synchronizedFlickings; }

  public set type(val: SyncOptions["type"]) {
    this._removeEvents(this._synchronizedFlickings);
    this._type = val;
    this._addEvents(this._synchronizedFlickings);
  }
  public set synchronizedFlickings(val: SyncOptions["synchronizedFlickings"]) {
    this._removeEvents(this._synchronizedFlickings);
    this._synchronizedFlickings = val;
    this._addEvents(this._synchronizedFlickings);
  }

  public constructor({
    type = SYNC.TYPE.CAMERA,
    synchronizedFlickings = [],
  }: Partial<SyncOptions> = {}) {
    this._type = type;
    this._synchronizedFlickings = synchronizedFlickings;
  }

  public init(flicking: Flicking): void {
    if (this._flicking) {
      this.destroy();
    }

    this._flicking = flicking;

    this._addEvents(this._synchronizedFlickings);

    this._synchronizedFlickings.forEach(synchronizedFlicking => {
      this._updateClass(synchronizedFlicking, 0);
    });
  }

  public destroy(): void {
    const flicking = this._flicking;

    if (!flicking) {
      return;
    }

    this._removeEvents(this._synchronizedFlickings);

    this._flicking = null;
  }

  public update(): void {
    this._synchronizedFlickings.forEach(synchronizedFlicking => {
      this._updateClass(synchronizedFlicking, synchronizedFlicking.flicking.camera.position);
    });
  }

  private _addEvents = (synchronizedFlickings: SychronisableFlickingOptions[]) => {
    synchronizedFlickings.forEach((synchronizedFlicking) => {
      if (this._type === "camera") {
        synchronizedFlicking.flicking.on(EVENTS.MOVE, this._onMove);
        synchronizedFlicking.flicking.on(EVENTS.MOVE_START, this._onMoveStart);
        synchronizedFlicking.flicking.on(EVENTS.MOVE_END, this._onMoveEnd);
      }
      if (this._type === "index" && synchronizedFlicking.isSlidable) {
        synchronizedFlicking.flicking.on(EVENTS.WILL_CHANGE, this._onChangeIndex);
      }
      if (this._type === "index" && synchronizedFlicking.isClickable) {
        synchronizedFlicking.flicking.on(EVENTS.SELECT, this._onChangeIndex);
      }
    });
  };

  private _removeEvents = (synchronizedFlickings: SychronisableFlickingOptions[]) => {
    synchronizedFlickings.forEach((synchronizedFlicking) => {
      if (this._type === "camera") {
        synchronizedFlicking.flicking.off(EVENTS.MOVE, this._onMove);
        synchronizedFlicking.flicking.off(EVENTS.MOVE_START, this._onMoveStart);
        synchronizedFlicking.flicking.off(EVENTS.MOVE_END, this._onMoveEnd);
      }
      if (this._type === "index" && synchronizedFlicking.isSlidable) {
        synchronizedFlicking.flicking.off(EVENTS.WILL_CHANGE, this._onChangeIndex);
      }
      if (this._type === "index" && synchronizedFlicking.isClickable) {
        synchronizedFlicking.flicking.off(EVENTS.SELECT, this._onChangeIndex);
      }
    });
  };

  private _onChangeIndex = (e: ComponentEvent) => {
    const flicking = e.currentTarget;
    const synchronizedFlickings = this._synchronizedFlickings;

    if (!flicking.initialized || synchronizedFlickings.reduce((isAnimationComplete, synchronizedFlicking) => isAnimationComplete || (synchronizedFlicking.flicking !== flicking && synchronizedFlicking.flicking.animating), false)) {
      return;
    }
    
    this._synchronizeByIndex(flicking, e["index"]);
  };

  private _onMove = (e: ComponentEvent): void => {
    const camera = e.currentTarget.camera;
    const progress = (camera.position - camera.range.min) / camera.rangeDiff;

    this._synchronizedFlickings.forEach(synchronizedFlicking => {
      if (synchronizedFlicking.flicking !== e.currentTarget) {
        synchronizedFlicking.flicking.camera.lookAt(synchronizedFlicking.flicking.camera.range.min + synchronizedFlicking.flicking.camera.rangeDiff * progress);
      }
    });
  };

  private _onMoveStart = (e: ComponentEvent): void => {
    this._synchronizedFlickings.forEach(synchronizedFlicking => {
      if (synchronizedFlicking.flicking !== e.currentTarget) {
        synchronizedFlicking.flicking.disableInput();
      }
    });
  };

  private _onMoveEnd = (e: ComponentEvent): void => {
    this._synchronizedFlickings.forEach(synchronizedFlicking => {
      if (synchronizedFlicking.flicking !== e.currentTarget) {
        synchronizedFlicking.flicking.enableInput();
        synchronizedFlicking.flicking.control.updateInput();
      }
    });
  };
  
  private _synchronizeByIndex = (flicking: Flicking, index: number) => {
    const synchronizedFlickings = this._synchronizedFlickings;
    const activePanel =  flicking.panels.find(panel => panel.index === index);
    const lastPanel = flicking.panels[flicking.panels.length - 1];

    if (!activePanel) {
      return;
    }

    this._removeEvents(synchronizedFlickings);
    synchronizedFlickings.forEach((synchronizedFlicking) => {
      const targetLastPanel = synchronizedFlicking.flicking.panels[synchronizedFlicking.flicking.panels.length - 1];
      const targetPos = activePanel.position / (lastPanel.position + (lastPanel.size / 2)) * (targetLastPanel.position + (targetLastPanel.size / 2));

      synchronizedFlicking.flicking.control.moveToPosition(targetPos, 500);
      if (synchronizedFlicking.activeClass) {
        this._updateClass(synchronizedFlicking, targetPos);
      }
    });
    this._addEvents(synchronizedFlickings);
  };
  
  private _updateClass(synchronizedFlicking: SychronisableFlickingOptions, pos: number) {
    const target = this._findNearsetPanel(synchronizedFlicking.flicking, pos);
    synchronizedFlicking.flicking.panels.forEach((panel) => {
      panel.index === target.index ? addClass(panel.element, synchronizedFlicking.activeClass) : removeClass(panel.element, synchronizedFlicking.activeClass);
    });
  };

  private _findNearsetPanel(flicking: Flicking, pos: number) {
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
