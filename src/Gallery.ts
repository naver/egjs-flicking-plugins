import Flicking, { EVENTS, Plugin } from "@egjs/flicking";

import { GALLERY } from "./const";
import { addClass, removeClass } from "./utils";

interface GalleryOptions {
  thumbs: Flicking | null;
  activeClass: string;
}

/**
 * Plugin to easily create image gallery
 * @ko 썸네일과 상호작용하는 이미지 갤러리를 만드는 플러그인
 * @memberof Flicking.Plugins
 */
class Gallery implements Plugin {
  /* Internal Values */
  private _flicking: Flicking | null = null;

  /* Options */
  private _thumbs: GalleryOptions["thumbs"];
  private _activeClass: GalleryOptions["activeClass"];

  public get thumbs() { return this._thumbs; }
  public get activeClass() { return this._activeClass; }

  public set thumbs(val: GalleryOptions["thumbs"]) {
    this._thumbs?.off(EVENTS.SELECT, this._onThumbsClick);
    this._thumbs = val;
    this._thumbs!.on(EVENTS.SELECT, this._onThumbsClick);
  }
  public set activeClass(val: GalleryOptions["activeClass"]) { this._activeClass = val; }

  public constructor({
    thumbs = null,
    activeClass = GALLERY.ACTIVE_CLASS,
  }: Partial<GalleryOptions> = {}) {
    this._thumbs = thumbs;
    this._activeClass = activeClass;
  }

  public init(flicking: Flicking): void {
    if (this._flicking) {
      this.destroy();
    }

    this._flicking = flicking;

    flicking.on(EVENTS.WILL_CHANGE, this._onIndexChange);
    this._thumbs?.on(EVENTS.SELECT, this._onThumbsClick);

    this.update();
  }

  public destroy(): void {
    const flicking = this._flicking;

    if (!flicking) {
      return;
    }

    flicking.off(EVENTS.WILL_CHANGE, this._onIndexChange);
    this._thumbs?.off(EVENTS.SELECT, this._onThumbsClick);

    this._flicking = null;
  }

  public update(): void {
    this._updateClass(this._flicking!.index);
  }

  private _onThumbsClick = (e: { index: number }) => {
    const flicking = this._flicking!;

    if (flicking.control.animating) return;
    flicking.moveTo(e.index);

  }

  private _onIndexChange = (e: { index: number }) => {
    const thumbs = this._thumbs!;

    this._updateClass(e.index);

    if (thumbs.control.animating) return;
    thumbs.moveTo(e.index);
  };
  
  private _updateClass(index: number) {
    const thumbs = this._thumbs!;
    thumbs.panels.forEach((panel) => panel.index === index ? addClass(panel.element, this._activeClass) : removeClass(panel.element, this._activeClass));
  }
}

export default Gallery;
